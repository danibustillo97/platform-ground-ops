import pyodbc


def get_db():
    server = "ara-dbsrv-01.database.windows.net"
    database = "Minerva"
    username = "API_Proxi"
    username = "API_Proxi"
    password = "{eprwQCC8BRrWAY}"
    driver = "{ODBC Driver 18 for SQL Server}"
    db = (
        "DRIVER="
        + driver
        + ";SERVER=tcp:"
        + server
        + ";PORT=1433;DATABASE="
        + database
        + ";UID="
        + username
        + ";PWD="
        + password
    )

    conn = pyodbc.connect(db)
    
    print(conn)
