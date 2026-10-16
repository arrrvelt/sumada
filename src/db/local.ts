import * as SQLite from "expo-sqlite";

export async function initLocalDb(db: SQLite.SQLiteDatabase) {
  await db.execAsync(`
    create table if not exists events (
      id text primary key,
      name text not null,
      room_code text not null
    );

    create table if not exists criteria (
        id text primary key,
        event_id text not null,
        name text not null,
        weight real not null,
        max real not null
    );

    create table if not exists judges (
        id text primary key, 
        event_id text not null,
        name text not null
    );

    create table if not exists contestants (
        id text primary key,
        event_id text not null,
        name text not null
    );

    create table if not exists scores (
        id text primary key,
        judge_id text not null,
        contestant_id text not null,
        criterion_id text not null,
        score real not null,
        updated_at text not null,
        synced integer not null default 0,
        unique (judge_id, contestant_id, criterion_id)
    );
  `);
}
