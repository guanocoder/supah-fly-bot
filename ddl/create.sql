create table inline_result
(
	file_id text not null
		constraint inline_query_result_pkey
			primary key,
	type text,
	hits integer default 0 not null,
	createdate timestamp default now() not null
)
;

create table inline_keyword_result
(
	keyword text not null,
	file_id text not null
		constraint inline_keyword_result_inline_result_file_id_fk
			references inline_result,
	constraint inline_keyword_result_keyword_file_id_pk
		primary key (keyword, file_id)
)
;

