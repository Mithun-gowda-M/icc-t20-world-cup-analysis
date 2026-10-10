# ICC T20 World Cup Data Dictionary

| Column Name | Data Type | Description | Example Values |
| :--- | :--- | :--- | :--- |
| `Match No` | Integer | Chronological match index in the respective tournament | `1`, `45` |
| `Date` | Date | Scheduled match calendar date (`YYYY-MM-DD`) | `2007-11-09` |
| `Group/Semi Final/Final`| Text | Competition stage category | `Group A`, `Semi Final`, `Final` |
| `Match Between` | Text | Opponent national teams in fixture | `South Africa vs West Indies` |
| `Venue` | Text | Stadium and host city location | `The Wanderers Stadium, Johannesburg` |
| `Winning Team Score`| Text | Raw scoreboard notation of victorious side | `208/2(17.4 overs)` |
| `Losing Team Score` | Text | Raw scoreboard notation of defeated side | `205/6(20 overs)` |
| `Winner Team` | Text | Victorious national cricket team | `South Africa`, `India`, `Pakistan` |
| `Result` | Text | Formal margin of victory declaration | `South Africa won by 8 wickets` |
| `Player Of The Match`| Text | Official individual performance award recipient | `Chris Gayle`, `Virat Kohli` |
| `Winning_Runs` | Integer | Extracted total runs made by winning team | `208` |
| `Winning_Wickets` | Integer | Extracted total wickets lost by winning team | `2` |
| `Losing_Runs` | Integer | Extracted total runs made by losing team | `205` |
| `Losing_Wickets` | Integer | Extracted total wickets lost by losing team | `6` |
| `Total_Match_Runs`| Integer | Aggregate combined match runs (`Winning + Losing`)| `413` |
| `Total_Match_Wickets`| Integer | Aggregate combined dismissals (`Winning + Losing`)| `8` |
