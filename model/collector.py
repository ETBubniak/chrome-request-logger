import sqlite3
import logging
from dataclasses import dataclass
from sqlite3 import Error


def create_table_if_none():
    conn = sqlite3.connect("data.db")
    try:
        conn.execute("CREATE TABLE collectors ("
                     "id INTEGER AUTOINCREMENT PRIMARY KEY, "
                     "source_name VARCHAR(255), "
                     "source_location VARCHAR(255), "
                     "source_data_amount INT);")
        logging.info("Successfully created table: collectors")
    except Error as e:
        logging.warning(e)
    finally:
        conn.close()


@dataclass
class Collector:
    source_name: str
    source_location: str
    source_data_amount: int
    pass

