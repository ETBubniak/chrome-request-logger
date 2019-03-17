import sqlite3
import logging
from dataclasses import dataclass
from sqlite3 import Error


def count_requests():
    conn = sqlite3.connect("data.db")
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT collector_name, COUNT(*) FROM collectors GROUP BY collector_name;")
        raw_data = cursor.fetchall()
        data = [list(x) for x in raw_data]
        return data
    except Error as e:
        logging.error(e)
    finally:
        print("hit")
        conn.close()


def create_table_if_none():
    conn = sqlite3.connect("data.db")
    cursor = conn.cursor()
    try:
        cursor.execute("CREATE TABLE IF NOT EXISTS collectors ("
                       "INTEGER PRIMARY KEY, "
                       "collector_name VARCHAR(255), "
                       "request_location VARCHAR(255));")
        logging.info("Successfully created table: collectors")
    except Error as e:
        logging.error(e)
    finally:
        conn.close()


@dataclass
class Collector:
    collector_name: str
    request_location: str

    def save(self):
        create_table_if_none()
        conn = sqlite3.connect("data.db")
        try:
            conn.execute("INSERT INTO collectors (collector_name, request_location) "
                         "VALUES ('{}', '{}');".format(self.collector_name, self.request_location))
            conn.commit()
        except Error as e:
            logging.error(e)
        finally:
            conn.close()
