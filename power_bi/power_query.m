/* ====================================================================
   ACADEMIC CAPSTONE SUBMISSION • FINAL YEAR ENGINEERING IN AIML
   Project: ICC T20 World Cup Analytics & Predictive AI Engine
   Author: Mithun Gowda M (Final Year B.E. / B.Tech AIML)
   Department: Department of Computer Science & Engineering (AIML)
   File: Power Query M ETL Script Suite
   Repository: https://github.com/Mithun-gowda-M/icc-t20-world-cup-analysis
   ==================================================================== */

// ====================================================================
// POWER QUERY (M) - ICC T20 WORLD CUP MULTI-FILE COMBINER & ETL
// ====================================================================

let
    Source = Csv.Document(File.Contents("data/all_t20_matches_2007_2021.csv"), [Delimiter=",", Columns=18, Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {
        {"Edition", Int64.Type},
        {"Match_No", Int64.Type},
        {"Date", type date},
        {"Stage", type text},
        {"Team1", type text},
        {"Team2", type text},
        {"Venue", type text},
        {"Winning_Score", type text},
        {"Losing_Score", type text},
        {"Winner", type text},
        {"Result", type text},
        {"Player_Of_The_Match", type text},
        {"Winning_Runs", Int64.Type},
        {"Winning_Wickets", Int64.Type},
        {"Losing_Runs", Int64.Type},
        {"Losing_Wickets", Int64.Type},
        {"Total_Match_Runs", Int64.Type},
        {"Total_Match_Wickets", Int64.Type}
    })
in
    Typed
