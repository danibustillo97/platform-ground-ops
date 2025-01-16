 SELECT 
        W.Rgo_Id_Departure_Date, FS.FLT, FS.DEP
      FROM Minerva.Fct_IOCC_Flight_Schedule FS
      LEFT JOIN (
        SELECT 
            DISTINCT
            M.Id_Departure_Date Rgo_Id_Departure_Date,
            M.Flight_Num Rgo_Flight_Num,
            M.From_Airport Rgo_From_Airport,
            M.To_Airport Rgo_To_Airport,
            SL.Departure_Date Rgo_Aims_Date
        FROM Minerva.Fct_Manifest M
        LEFT JOIN (
            SELECT
                S.Id_Departure_Date,
                CAST(IIF(CHARINDEX('/', S.Operating_Flight_Num) > 0, LEFT(S.Operating_Flight_Num, CHARINDEX('/', S.Operating_Flight_Num)-1), S.Operating_Flight_Num) AS INT) Flight_Num,
                S.From_Airport,
                S.To_Airport,
                CAST(MF.passenger_std_utc AS DATE) Departure_Date,
                FORMAT(CAST(MF.passenger_std_utc AS DATE), 'yyyyMMdd') Id_Departure_Date_Fix
            FROM [Minerva].[Fct_RD_Segment] S
            LEFT JOIN Minerva.Fct_RD_Marketed_Flights MF ON MF.logical_flight_id = S.Logical_flight_Id
            WHERE Segment_Status != 'CANCELED'
            GROUP BY
                S.Id_Departure_Date,
                CAST(IIF(CHARINDEX('/', S.Operating_Flight_Num) > 0, LEFT(S.Operating_Flight_Num, CHARINDEX('/', S.Operating_Flight_Num)-1), S.Operating_Flight_Num) AS INT),
                S.From_Airport,
                S.To_Airport,
                CAST(MF.passenger_std_utc AS DATE),
                FORMAT(CAST(MF.passenger_std_utc AS DATE), 'yyyyMMdd')
        ) SL ON SL.Id_Departure_Date = M.Id_Departure_Date
        AND SL.Flight_Num = M.Flight_Num
        AND SL.From_Airport = M.From_Airport
        AND SL.To_Airport = M.To_Airport
        WHERE M.DCS_Status like 'BOARDED%'
      ) W ON W.Rgo_Aims_Date = FS.date AND W.Rgo_Flight_Num = FS.FLT AND W.Rgo_From_Airport = FS.DEP
      WHERE FS.date_Local = '2024-01-10'













      SELECT * FROM Minerva.Fct_AIMS_Flight_Schedule