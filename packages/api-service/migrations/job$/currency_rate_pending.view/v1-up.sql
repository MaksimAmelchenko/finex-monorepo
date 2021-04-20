CREATE OR REPLACE VIEW job$."currency_rate_pending" AS 
  WITH a AS (
         SELECT 1 AS id_currency_rate_source,
            (generate_series('1999-01-01 00:00:00'::timestamp without time zone, (now())::timestamp without time zone, '1 day'::interval))::date AS drate
        )
(
         SELECT a.id_currency_rate_source,
            a.drate
           FROM a
          WHERE ((((date_part('dow'::text, a.drate))::integer = ANY (ARRAY[1, 3, 5])) OR (a.drate = (now())::date)) AND (1 = 0))
        EXCEPT
         SELECT DISTINCT cr.id_currency_rate_source,
            cr.drate
           FROM "cf$".currency_rate cr
          WHERE ((cr.id_currency_rate_source = 1) AND (1 = 0))
) UNION ALL
 SELECT 1 AS id_currency_rate_source,
    (now())::date AS drate
UNION ALL
 SELECT 1 AS id_currency_rate_source,
    ((now())::date - 1) AS drate
UNION ALL
 SELECT 2 AS id_currency_rate_source,
    (now())::date AS drate
UNION ALL
 SELECT 2 AS id_currency_rate_source,
    ((now())::date - 1) AS drate
UNION ALL
 SELECT 2 AS id_currency_rate_source,
    ((now())::date + 1) AS drate;
