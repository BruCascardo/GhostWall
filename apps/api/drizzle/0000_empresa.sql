CREATE TABLE "empresa" (
	"cuit" varchar(11) PRIMARY KEY NOT NULL,
	"razon_social" varchar(150) NOT NULL,
	"fecha_alta" timestamp with time zone DEFAULT now() NOT NULL,
	"estado" varchar(20) DEFAULT 'ACTIVO' NOT NULL,
	CONSTRAINT "empresa_cuit_formato" CHECK ("empresa"."cuit" ~ '^[0-9]{11}$'),
	CONSTRAINT "empresa_estado_valido" CHECK ("empresa"."estado" in ('ACTIVO', 'SUSPENDIDO', 'INACTIVO'))
);
