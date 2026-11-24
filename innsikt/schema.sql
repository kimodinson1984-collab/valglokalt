-- Draft only. No deployment or collection authorized by this migration.
CREATE TABLE IF NOT EXISTS daily_feature_counts (
  day_utc TEXT NOT NULL CHECK(length(day_utc)=10),
  municipality TEXT NOT NULL CHECK(municipality IN ('1508')),
  feature TEXT NOT NULL CHECK(feature IN ('overview','council','committees','districts','governance','ownership','decisions','barometer','voter_influence','party_overview','political_atlas','political_landscape','calculator_open','election_school','data_status')),
  total INTEGER NOT NULL DEFAULT 0 CHECK(total >= 0),
  PRIMARY KEY(day_utc,municipality,feature)
) WITHOUT ROWID;
-- No raw events, identities, session keys, political selections or free text.
-- Retention to be implemented as a scheduled deletion before enabling collection.
