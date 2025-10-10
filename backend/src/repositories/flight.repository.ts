import pool from "../config/database";
import {
  Flight,
  CreateFlightDto,
  UpdateFlightDto,
  FlightTotals,
} from "../types";
import { DatabaseError, NotFoundError } from "../utils/errors";

export class FlightRepository {
  async create(userId: string, data: CreateFlightDto): Promise<Flight> {
    try {
      const result = await pool.query(
        `INSERT INTO flights 
        (user_id, date, departure_airport, arrival_airport, aircraft_type, flight_hours, is_night, is_solo)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`,
        [
          userId,
          data.date,
          data.departureAirport,
          data.arrivalAirport,
          data.aircraftType,
          data.flightHours,
          data.isNight,
          data.isSolo,
        ]
      );
      return this.mapRowToFlight(result.rows[0]);
    } catch (error) {
      throw new DatabaseError(
        `Failed to create flight: ${(error as Error).message}`
      );
    }
  }

  async findById(id: string): Promise<Flight | null> {
    try {
      const result = await pool.query("SELECT * FROM flights WHERE id = $1", [
        id,
      ]);
      return result.rows.length > 0
        ? this.mapRowToFlight(result.rows[0])
        : null;
    } catch (error) {
      throw new DatabaseError(
        `Failed to find flight: ${(error as Error).message}`
      );
    }
  }

  async findByUserId(
    userId: string,
    limit = 100,
    offset = 0
  ): Promise<Flight[]> {
    try {
      const result = await pool.query(
        "SELECT * FROM flights WHERE user_id = $1 ORDER BY date DESC, created_at DESC LIMIT $2 OFFSET $3",
        [userId, limit, offset]
      );
      return result.rows.map(this.mapRowToFlight);
    } catch (error) {
      throw new DatabaseError(
        `Failed to find flights: ${(error as Error).message}`
      );
    }
  }

  async update(id: string, data: UpdateFlightDto): Promise<Flight> {
    try {
      // Build dynamic update query
      const fields: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          const snakeKey = key.replace(
            /[A-Z]/g,
            (letter) => `_${letter.toLowerCase()}`
          );
          fields.push(`${snakeKey} = $${paramCount}`);
          values.push(value);
          paramCount++;
        }
      });

      if (fields.length === 0) {
        throw new Error("No fields to update");
      }

      fields.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(id);

      const query = `UPDATE flights SET ${fields.join(", ")} WHERE id = $${paramCount} RETURNING *`;
      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        throw new NotFoundError("Flight not found");
      }

      return this.mapRowToFlight(result.rows[0]);
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError(
        `Failed to update flight: ${(error as Error).message}`
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const result = await pool.query(
        "DELETE FROM flights WHERE id = $1 RETURNING id",
        [id]
      );
      if (result.rows.length === 0) {
        throw new NotFoundError("Flight not found");
      }
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError(
        `Failed to delete flight: ${(error as Error).message}`
      );
    }
  }

  async getTotalsByUserId(userId: string): Promise<FlightTotals | null> {
    try {
      const result = await pool.query(
        "SELECT * FROM flight_totals WHERE user_id = $1",
        [userId]
      );
      return result.rows.length > 0
        ? this.mapRowToTotals(result.rows[0])
        : null;
    } catch (error) {
      throw new DatabaseError(
        `Failed to get totals: ${(error as Error).message}`
      );
    }
  }

  async recalculateTotals(userId: string): Promise<FlightTotals> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const result = await client.query(
        `SELECT 
          COUNT(*)::INTEGER as total_flights,
          COALESCE(SUM(flight_hours), 0) as total_hours,
          COALESCE(SUM(CASE WHEN is_night = false THEN flight_hours ELSE 0 END), 0) as day_hours,
          COALESCE(SUM(CASE WHEN is_night = true THEN flight_hours ELSE 0 END), 0) as night_hours,
          COALESCE(SUM(CASE WHEN is_solo = true THEN flight_hours ELSE 0 END), 0) as solo_hours
        FROM flights 
        WHERE user_id = $1`,
        [userId]
      );

      const stats = result.rows[0];

      const updateResult = await client.query(
        `INSERT INTO flight_totals (user_id, total_hours, day_hours, night_hours, solo_hours, total_flights, last_updated)
        VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
        ON CONFLICT (user_id) 
        DO UPDATE SET 
          total_hours = $2,
          day_hours = $3,
          night_hours = $4,
          solo_hours = $5,
          total_flights = $6,
          last_updated = CURRENT_TIMESTAMP
        RETURNING *`,
        [
          userId,
          stats.total_hours,
          stats.day_hours,
          stats.night_hours,
          stats.solo_hours,
          stats.total_flights,
        ]
      );

      await client.query("COMMIT");
      return this.mapRowToTotals(updateResult.rows[0]);
    } catch (error) {
      await client.query("ROLLBACK");
      throw new DatabaseError(
        `Failed to recalculate totals: ${(error as Error).message}`
      );
    } finally {
      client.release();
    }
  }

  private mapRowToFlight(row: any): Flight {
    return {
      id: row.id,
      userId: row.user_id,
      date: row.date,
      departureAirport: row.departure_airport,
      arrivalAirport: row.arrival_airport,
      aircraftType: row.aircraft_type,
      flightHours: parseFloat(row.flight_hours),
      isNight: row.is_night,
      isSolo: row.is_solo,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private mapRowToTotals(row: any): FlightTotals {
    return {
      userId: row.user_id,
      totalHours: parseFloat(row.total_hours),
      dayHours: parseFloat(row.day_hours),
      nightHours: parseFloat(row.night_hours),
      soloHours: parseFloat(row.solo_hours),
      totalFlights: row.total_flights,
      lastUpdated: row.last_updated,
    };
  }
}
