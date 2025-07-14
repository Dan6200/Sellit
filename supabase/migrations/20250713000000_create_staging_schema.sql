-- Create the staging schema
create schema if not exists staging;

-- Set search path to include staging for easier table creation
set search_path to staging, public;

-- Replicate trigger_set_timestamp function
create or replace function staging.trigger_set_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Replicate users table
create table if not exists staging.users (
  user_id 		 uuid                    primary    key,
  first_name   varchar(30)               not        null,
	check				 (first_name ~* '^[a-zA-Z]+$'),
  last_name    varchar(30)               not        null,
	check				 (last_name ~* '^[a-zA-Z]+([-'']*[a-zA-Z]+)+$'),
  email        varchar(320)              unique,
  check        (email ~* '^(([^<> ()[\]\\.,;:\s@"]+(\.[^< > ()[\]\\.,;'
							 ':\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1'
							 ',3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$'),
  phone        varchar(40)               unique,
  check        (phone ~* '^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$'),
	check				 (email is not null and phone is not null
							 or email is null and phone is not null
							 or email is not null and phone is null),
  dob          date                      not        null,
  country      varchar                   not        null 			default  		'Nigeria',
	is_customer  boolean 									 not 				null 			default 		true,
	is_vendor    boolean 									 not 				null 			default 		false,
  check        (current_date - dob > 18),
  deleted_at   timestamptz,
  created_at   timestamptz               not 				null 			default      now(),
  updated_at   timestamptz               not 				null 			default      now()
);

-- create a trigger to update the updated_at column for staging.users
create trigger set_timestamp
before update on staging.users
for each row
execute procedure staging.trigger_set_timestamp();

-- Replicate shipping_info table
create table if not exists staging.shipping_info (
  shipping_info_id        serial        primary   key,
  customer_id             uuid           not      null    references   staging.users   on   delete   cascade,
  recipient_full_name    	varchar(30)   not       null,
  address_line_1          varchar       not       null,
  address_line_2          varchar       not       null,
  city                    varchar       not       null,
  state                   varchar       not       null,
  zip_postal_code         varchar       not       null,
  country									varchar       not       null,
  phone_number 		        varchar       not       null,
  created_at        			timestamptz     		not 			null 		default     now(),
  updated_at        			timestamptz     		not 			null 		default     now(),
  delivery_instructions   varchar
);

-- create a trigger to update the updated_at column for staging.shipping_info
create trigger set_timestamp
before update on staging.shipping_info
for each row
execute procedure staging.trigger_set_timestamp();

-- Replicate payment_info table
create table if not exists staging.payment_info (
	payment_id 				serial 				primary 			key,
	payment_token 		varchar 			not 					null,
  created_at        timestamptz     not 		null 			default     now(),
  updated_at        timestamptz     not 		null 			default     now()
);

-- create a trigger to update the updated_at column for staging.payment_info
create trigger set_timestamp
before update on staging.payment_info
for each row
execute procedure staging.trigger_set_timestamp();

-- Replicate stores table
create table if not exists staging.stores (
  store_id                 serial      primary   key,
  store_name               varchar     not       null,
	custom_domain            varchar     null,
  vendor_id                uuid        not       null    references   staging.users        on   delete   cascade,
  favicon                  varchar,
  default_page_styling     jsonb,
  store_pages              jsonb,
  created_at                timestamptz not       null    default      now(),
  updated_at               timestamptz default      now()
);

-- create a trigger to update the updated_at column for staging.stores
create trigger set_timestamp
before update on staging.stores
for each row
execute procedure staging.trigger_set_timestamp();

-- Replicate categories table
create table if not exists staging.categories (
	category_id					serial					primary 	key,
	category_name 			varchar,
  created_at          timestamptz     not 			null 				default     now(),
  updated_at          timestamptz     not 			null 				default     now()
);

-- create a trigger to update the updated_at column for staging.categories
create trigger set_timestamp
before update on staging.categories
for each row
execute procedure staging.trigger_set_timestamp();

-- Replicate subcategories table
create table if not exists staging.subcategories (
	subcategory_id			serial				primary 		key,
	category_id 				int						not 				null		references		staging.categories			on 		delete	cascade,
	subcategory_name		varchar,
  created_at          timestamptz     not 			null 			default     now(),
  updated_at          timestamptz     not 			null 			default     now()
);

-- create a trigger to update the updated_at column for staging.subcategories
create trigger set_timestamp
before update on staging.subcategories
for each row
execute procedure staging.trigger_set_timestamp();

-- Replicate products table
create table if not exists staging.products (
  product_id           serial           primary   key,
  title                varchar,
  description          text[],
  list_price           numeric(19,4),
  net_price            numeric(19,4),
  vendor_id            uuid             not       null    references			staging.users         on   delete   cascade,
	store_id 						 int 							not 			null 		references 			staging.stores 					on 	 delete 	cascade,
  category_id          int           		not    		null    references   		staging.categories      on   delete   cascade,
  subcategory_id       int           		not    		null    references   		staging.subcategories   on   delete   cascade,
  quantity_available   int              not       null,
  created_at           timestamptz      not 			null 		default      now(),
  updated_at           timestamptz      not 			null 		default      now()
);

-- create a trigger to update the updated_at column for staging.products
create trigger set_timestamp
before update on staging.products
for each row
execute procedure staging.trigger_set_timestamp();

-- Replicate orders table
create table staging.orders (
    order_id 						serial						primary 				key,
    customer_id 				uuid						references 			staging.users 						on delete cascade not null,
    store_id 						serial						references 			staging.stores 						on delete cascade not null,
    shipping_info_id 		serial						references 			staging.shipping_info 		on delete set null,
    order_date 					timestamptz				default 				now(),
    total_amount 				numeric(10, 2)		not null,
    status 							text							default 				'pending' 				not null,
    created_at 					timestamptz				not 						null 							default 				now(),
    updated_at 					timestamptz				not 						null 							default 				now()
);

-- create a trigger to update the updated_at column for staging.orders
create trigger set_timestamp
before update on staging.orders
for each row
execute procedure staging.trigger_set_timestamp();

-- Replicate order_items table
create table staging.order_items (
    order_item_id       serial          primary     key,
    order_id            serial          not         null    references  staging.orders          on  delete  cascade,
    product_id          int             not         null    references  staging.products        on  delete  cascade,
    quantity            int             not         null    check       (quantity > 0),
    price_at_purchase   numeric(19,4)   not         null,
    created_at          timestamptz     not 				null 		default     now(),
    updated_at          timestamptz     not 				null 		default     now()
);

-- create a trigger to update the updated_at column for staging.order_items
create trigger set_timestamp
before update on staging.order_items
for each row
execute procedure staging.trigger_set_timestamp();

-- Replicate product_media table
create table if not exists staging.product_media (
  product_id					int					not null   references   staging.products   on   delete   cascade,
  filename						varchar			primary    key,
  filepath						varchar			not        null,
  description					varchar,
	is_display_image		boolean			default		 false,
	is_landing_image		boolean			default		 false,
	filetype            varchar     not        null    default    'image',
  created_at          timestamptz     not  	 null 				default     now(),
  updated_at          timestamptz     not  	 null 				default     now(),
  check (filetype in ('image', 'video')),
  check (not (is_display_image = true and filetype != 'image')),
  check (not (is_landing_image = true and filetype != 'image'))
);

-- create a trigger to update the updated_at column for staging.product_media
create trigger set_timestamp
before update on staging.product_media
for each row
execute procedure staging.trigger_set_timestamp();

-- Replicate product_media_display_landing_trigger function
create or replace function staging.product_media_display_landing_trigger ()
returns trigger as $$

begin
    if (tg_op='insert' or tg_op='update') then
        if new.is_display_image=true then
            update staging.product_media
            set is_display_image = false
            where product_id = new.product_id
              and filename != new.filename
              and is_display_image = true;
        end if;
        if new.is_landing_image=true then
            update staging.product_media
            set is_landing_image = false
            where product_id = new.product_id
              and filename != new.filename
              and is_landing_image = true;
        end if;
    end if;
    return new;
end;
$$ language plpgsql;

-- Replicate product_media_display_landing trigger
create trigger product_media_display_landing
before insert or update on staging.product_media
for each row execute function staging.product_media_display_landing_trigger();

-- Replicate shopping_cart table
create table if not exists staging.shopping_cart (
  cart_id       serial        primary   key,
  customer_id   uuid           not       null   references   staging.users   on   delete   cascade,
  created_at    timestamptz   not       null   default      now(),
  updated_at    timestamptz   not       null   default      now()
);

-- create a trigger to update the updated_at column for staging.shopping_cart
create trigger set_timestamp
before update on staging.shopping_cart
for each row
execute procedure staging.trigger_set_timestamp();

-- Replicate shopping_cart_item table
create table if not exists staging.shopping_cart_item (
  item_id      serial   primary   key,
  cart_id      int      not       null   references   staging.shopping_cart   on   delete   cascade,
  product_id   int      not       null   references   staging.products        on   delete   cascade,
  quantity     int      not       null   check        (quantity > 0),
  created_at    timestamptz   not       null   default      now(),
  updated_at    timestamptz   not       null   default      now()
);

-- create a trigger to update the updated_at column for staging.shopping_cart_item
create trigger set_timestamp
before update on staging.shopping_cart_item
for each row
execute procedure staging.trigger_set_timestamp();

-- Replicate transactions table
create table if not exists staging.transactions(
  transaction_id   serial           primary      key,
  customer_id      uuid              not          null    references   staging.users,
  vendor_id        uuid              not          null    references   staging.users,
  total_amount     numeric(19,4)    not          null,
  created_at       timestamptz      not          null    default   now(),
  updated_at       timestamptz      not          null    default   now(),
  check            (customer_id <>  vendor_id)
);

-- create a trigger to update the updated_at column for staging.transactions
create trigger set_timestamp
before update on staging.transactions
for each row
execute procedure staging.trigger_set_timestamp();

-- Replicate purchases table
create table if not exists staging.purchases (
  item_id          serial        primary   key,
  product_id       int           not       null   references   staging.products              on        delete   cascade,
  transaction_id   int           not       null   references   staging.transactions				   on        delete   cascade,
  created_at       timestamptz   not       null   default      now(),
  updated_at       timestamptz   not       null   default      now(),
  quantity         int           not       null   check        (quantity > 0)
);

-- create a trigger to update the updated_at column for staging.purchases
create trigger set_timestamp
before update on staging.purchases
for each row
execute procedure staging.trigger_set_timestamp();

-- Replicate product_reviews table
create table if not exists staging.product_reviews (
  review_id         serial         primary key,
  product_id        int            not       null    references   staging.products              on   delete   cascade,
  transaction_id    int            not       null    references   staging.transactions				  on   delete   cascade,
  rating            numeric(3,2)   not       null,
  customer_id       uuid            not       null    references   staging.users             on   delete   cascade,
  customer_remark   varchar,
  created_at    timestamptz   not       null   default      now(),
  updated_at    timestamptz   not       null   default      now()
);

-- create a trigger to update the updated_at column for staging.product_reviews
create trigger set_timestamp
before update on staging.product_reviews
for each row
execute procedure staging.trigger_set_timestamp();

-- Replicate vendor_reviews table
create table if not exists staging.vendor_reviews (
  review_id         serial         primary key,
  vendor_id         uuid            not       null    references   staging.users               on   delete   cascade,
  customer_id       uuid            not       null    references   staging.users             on   delete   cascade,
  transaction_id    int            not       null    references   staging.transactions				  on   delete   cascade,
  rating            numeric(3,2)   not       null,
  customer_remark   varchar,
  created_at    timestamptz   not       null   default      now(),
  updated_at    timestamptz   not       null   default      now()
);

-- create a trigger to update the updated_at column for staging.vendor_reviews
create trigger set_timestamp
before update on staging.vendor_reviews
for each row
execute procedure staging.trigger_set_timestamp();

-- Replicate customer_reviews table
create table if not exists staging.customer_reviews (
  review_id        serial         primary key,
  customer_id      uuid            not       null    references   staging.users             on   delete   cascade,
  vendor_id        uuid            not       null    references   staging.users               on   delete   cascade,
  transaction_id   int            not       null    references   staging.transactions   on   delete   cascade,
  rating           numeric(3,2)   not       null,
  vendor_remark    varchar,
  created_at    timestamptz   not       null   default      now(),
  updated_at    timestamptz   not       null   default      now()
);

-- create a trigger to update the updated_at column for staging.customer_reviews
create trigger set_timestamp
before update on staging.customer_reviews
for each row
execute procedure staging.trigger_set_timestamp();

-- Replicate handle_new_user function
create or replace function staging.handle_new_user()
returns trigger as $$
begin
  insert into staging.users (user_id, first_name, last_name, email, phone, dob, country, is_customer, is_vendor)
  values (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.email,
    new.phone,
    (new.raw_user_meta_data->>'dob')::date,
    coalesce(new.raw_user_meta_data->>'country', 'Nigeria'),
    coalesce((new.raw_user_meta_data->>'is_customer')::boolean, true),
    coalesce((new.raw_user_meta_data->>'is_vendor')::boolean, false)
  );
  return new;
end;
$$ language plpgsql security definer;

-- Replicate on_auth_user_created trigger
create trigger on_auth_user_created_staging
  after insert on auth.users
  for each row execute procedure staging.handle_new_user();

-- Replicate handle_update_user function
create or replace function staging.handle_update_user()
returns trigger as $$
begin
  update staging.users
  set
    first_name = new.raw_user_meta_data->>'first_name',
    last_name = new.raw_user_meta_data->>'last_name',
    email = new.email,
    phone = new.phone,
    dob = (new.raw_user_meta_data->>'dob')::date,
    country = coalesce(new.raw_user_meta_data->>'country', 'Nigeria'),
    is_customer = coalesce((new.raw_user_meta_data->>'is_customer')::boolean, true),
    is_vendor = coalesce((new.raw_user_meta_data->>'is_vendor')::boolean, false)
  where user_id = new.id;
  return new;
end;
$$ language plpgsql security definer;

-- Replicate on_auth_user_updated trigger
create trigger on_auth_user_updated_staging
  after update on auth.users
  for each row execute procedure staging.handle_update_user();

-- Replicate handle_delete_user function
create or replace function staging.handle_delete_user()
returns trigger as $$
begin
  update staging.users
  set deleted_at = now()
  where user_id = old.id;
  return old;
end;
$$ language plpgsql security definer;

-- Replicate on_auth_user_deleted trigger
create trigger on_auth_user_deleted_staging
  after delete on auth.users
  for each row execute procedure staging.handle_delete_user();

