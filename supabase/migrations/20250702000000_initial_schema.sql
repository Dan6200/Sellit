drop schema if exists public cascade;
create schema if not exists public;

-- function to update updated_at column
create or replace function trigger_set_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists users (
  user_id 		 uuid                    primary    key, -- Get from Firebase
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

-- create a trigger to update the updated_at column for users
create trigger set_timestamp
before update on users
for each row
execute procedure trigger_set_timestamp();



create table if not exists shipping_info (
  shipping_info_id        serial        primary   key,
  customer_id             uuid           not      null    references   users   on   delete   cascade,
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


-- create a trigger to update the updated_at column for shipping_info
create trigger set_timestamp
before update on shipping_info
for each row
execute procedure trigger_set_timestamp();

create table if not exists payment_info (
	payment_id 				serial 				primary 			key,
	payment_token 		varchar 			not 					null,
  created_at        timestamptz     not 		null 			default     now(),
  updated_at        timestamptz     not 		null 			default     now()
);

-- create a trigger to update the updated_at column for payment_info
create trigger set_timestamp
before update on payment_info
for each row
execute procedure trigger_set_timestamp();

create table if not exists stores (
  store_id                 serial      primary   key,   
  store_name               varchar     not       null,
	custom_domain            varchar     null,
  vendor_id                uuid        not       null    references   users        on   delete   cascade,
  favicon                  varchar,
  default_page_styling     jsonb,
  store_pages              jsonb,
  created_at                timestamptz not       null    default      now(),
  updated_at               timestamptz default      now()
);

-- create a trigger to update the updated_at column for stores
create trigger set_timestamp
before update on stores
for each row
execute procedure trigger_set_timestamp();

create table if not exists categories (
	category_id					serial					primary 	key,
	category_name 			varchar,
  created_at          timestamptz     not 			null 				default     now(),
  updated_at          timestamptz     not 			null 				default     now()
);

-- create a trigger to update the updated_at column for categories
create trigger set_timestamp
before update on categories
for each row
execute procedure trigger_set_timestamp();

create table if not exists subcategories (
	subcategory_id			serial				primary 		key,
	category_id 				int						not 				null		references		categories			on 		delete	cascade,
	subcategory_name		varchar,
  created_at          timestamptz     not 			null 			default     now(),
  updated_at          timestamptz     not 			null 			default     now()
);

-- create a trigger to update the updated_at column for subcategories
create trigger set_timestamp
before update on subcategories
for each row
execute procedure trigger_set_timestamp();

create table if not exists products (
  product_id           serial           primary   key,
  title                varchar,
  description          text[],
  list_price           numeric(19,4),
  net_price            numeric(19,4),
  vendor_id            uuid             not       null    references			users         on   delete   cascade,
	store_id 						 int 							not 			null 		references 			stores 					on 	 delete 	cascade,
  category_id          int           		not    		null    references   		categories      on   delete   cascade,
  subcategory_id       int           		not    		null    references   		subcategories   on   delete   cascade,
  quantity_available   int              not       null,
  created_at           timestamptz      not 			null 		default      now(),
  updated_at           timestamptz      not 			null 		default      now()
);

-- create a trigger to update the updated_at column for products
create trigger set_timestamp
before update on products
for each row
execute procedure trigger_set_timestamp();

-- create orders table
create table if not exists orders (
    order_id 						serial						primary 				key,
    customer_id 				uuid						references 			users 						on delete cascade not null,
    store_id 						serial						references 			stores 						on delete cascade not null,
    shipping_info_id 		serial						references 			shipping_info 		on delete set null,
    order_date 					timestamptz				default 				now(),
    total_amount 				numeric(10, 2)		not null,
    status 							text							default 				'pending' 				not null,
    created_at 					timestamptz				not 						null 							default 				now(),
    updated_at 					timestamptz				not 						null 							default 				now()
);

-- create a trigger to update the updated_at column for orders
create trigger set_timestamp
before update on orders
for each row
execute procedure trigger_set_timestamp();

-- create order_items table
create table if not exists order_items (
    order_item_id       serial          primary     key,
    order_id            serial          not         null    references  orders          on  delete  cascade,
    product_id          int             not         null    references  products        on  delete  cascade,
    quantity            int             not         null    check       (quantity > 0),
    price_at_order_item   numeric(19,4)   not         null,
    created_at          timestamptz     not 				null 		default     now(),
    updated_at          timestamptz     not 				null 		default     now()
);

-- create a trigger to update the updated_at column for order_items
create trigger set_timestamp
before update on order_items
for each row
execute procedure trigger_set_timestamp();

create table if not exists product_media (
  product_id					int					not null   references   products   on   delete   cascade,
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

-- create a trigger to update the updated_at column for product_media
create trigger set_timestamp
before update on product_media
for each row
execute procedure trigger_set_timestamp();

-- update landing image or display image for all rows when one row is changed
create or replace function product_media_display_landing_trigger () 
returns trigger as $$

begin 
    if (tg_op='insert' or tg_op='update') then
        if new.is_display_image=true then
            update product_media
            set is_display_image = false
            where product_id = new.product_id
              and filename != new.filename
              and is_display_image = true;
        end if;
        if new.is_landing_image=true then
            update product_media
            set is_landing_image = false
            where product_id = new.product_id
              and filename != new.filename
              and is_landing_image = true;
        end if;
    end if;
    return new;
end;
$$ language plpgsql;

create trigger product_media_display_landing
before insert or update on product_media
for each row execute function product_media_display_landing_trigger();

create table if not exists shopping_cart (
  cart_id       serial        primary   key,
  customer_id   uuid           not       null   references   users   on   delete   cascade,
  created_at    timestamptz   not       null   default      now(),
  updated_at    timestamptz   not       null   default      now()
);

-- create a trigger to update the updated_at column for shopping_cart
create trigger set_timestamp
before update on shopping_cart
for each row
execute procedure trigger_set_timestamp();

create table if not exists shopping_cart_item (
  item_id      serial   primary   key,
  cart_id      int      not       null   references   shopping_cart   on   delete   cascade,
  product_id   int      not       null   references   products        on   delete   cascade,
  quantity     int      not       null   check        (quantity > 0),
  created_at    timestamptz   not       null   default      now(),
  updated_at    timestamptz   not       null   default      now()
);

-- create a trigger to update the updated_at column for shopping_cart_item
create trigger set_timestamp
before update on shopping_cart_item
for each row
execute procedure trigger_set_timestamp();

create table if not exists product_reviews (
	order_item_id 			serial 						primary key 	 references order_items 				on 			delete 	 cascade,
  rating            numeric(3,2)   not       null    check (rating >= 0.00 and rating <= 5.00),
  customer_id       uuid            not       null    references   users             on   delete   cascade,
  customer_remark   varchar,
  created_at    timestamptz   not       null   default      now(),
  updated_at    timestamptz   not       null   default      now()
);

-- create a trigger to update the updated_at column for product_reviews
create trigger set_timestamp
before update on product_reviews
for each row
execute procedure trigger_set_timestamp();

create table if not exists vendor_reviews (
  vendor_id         uuid            not       null    references   users               on   delete   cascade,
  customer_id       uuid            not       null    references   users             on   delete   cascade,
  order_id    int            not       null    references   orders				  on   delete   cascade,
  rating            numeric(3,2)   not       null    check (rating >= 0.00 and rating <= 5.00),
  customer_remark   varchar,
  created_at    timestamptz   not       null   default      now(),
  updated_at    timestamptz   not       null   default      now(),
  primary key (vendor_id, order_id)
);

-- create a trigger to update the updated_at column for vendor_reviews
create trigger set_timestamp
before update on vendor_reviews
for each row
execute procedure trigger_set_timestamp();

create table if not exists customer_reviews (
  customer_id      uuid            not       null    references   users             on   delete   cascade,
  vendor_id        uuid            not       null    references   users               on   delete   cascade,
  order_id   int            not       null    references   orders   on   delete   cascade,
  rating           numeric(3,2)   not       null    check (rating >= 0.00 and rating <= 5.00),
  vendor_remark    varchar,
  created_at    timestamptz   not       null   default      now(),
  updated_at    timestamptz   not       null   default      now(),
  primary key (customer_id, order_id)
);

-- create a trigger to update the updated_at column for customer_reviews
create trigger set_timestamp
before update on customer_reviews
for each row
execute procedure trigger_set_timestamp();
-- Function to handle new user creation in auth.users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (user_id, first_name, last_name, email, phone, dob, country, is_customer, is_vendor)
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

-- Trigger to call handle_new_user on auth.users insert
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to handle user updates from auth.users
create or replace function public.handle_update_user()
returns trigger as $$
begin
  update public.users
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

-- Trigger to call handle_update_user on auth.users update
create trigger on_auth_user_updated
  after update on auth.users
  for each row execute procedure public.handle_update_user();

-- Function to handle user deletion from auth.users
create or replace function public.handle_delete_user()
returns trigger as $$
begin
  update public.users
  set deleted_at = now() -- <- Soft Delete. Set cronjob to delete after 30 days
  where user_id = old.id;
  return old;
end;
$$ language plpgsql security definer;

-- Trigger to call handle_delete_user on auth.users delete
create trigger on_auth_user_deleted
  after delete on auth.users
  for each row execute procedure public.handle_delete_user();

-- Enable RLS for tables and create basic select policies
alter table users enable row level security;
create policy "Public users are viewable by everyone." on users for select using (true);

alter table shipping_info enable row level security;
create policy "Public shipping_info are viewable by everyone." on shipping_info for select using (true);

alter table payment_info enable row level security;
create policy "Public payment_info are viewable by everyone." on payment_info for select using (true);

alter table stores enable row level security;
create policy "Public stores are viewable by everyone." on stores for select using (true);

alter table categories enable row level security;
create policy "Public categories are viewable by everyone." on categories for select using (true);

alter table subcategories enable row level security;
create policy "Public subcategories are viewable by everyone." on subcategories for select using (true);

alter table products enable row level security;
create policy "Public products are viewable by everyone." on products for select using (true);

alter table orders enable row level security;
create policy "Public orders are viewable by everyone." on orders for select using (true);

alter table order_items enable row level security;
create policy "Public order_items are viewable by everyone." on order_items for select using (true);

alter table product_media enable row level security;
create policy "Public product_media are viewable by everyone." on product_media for select using (true);

alter table shopping_cart enable row level security;
create policy "Public shopping_cart are viewable by everyone." on shopping_cart for select using (true);

alter table shopping_cart_item enable row level security;
create policy "Public shopping_cart_item are viewable by everyone." on shopping_cart_item for select using (true);

alter table product_reviews enable row level security;
create policy "Public product_reviews are viewable by everyone." on product_reviews for select using (true);

alter table vendor_reviews enable row level security;
create policy "Public vendor_reviews are viewable by everyone." on vendor_reviews for select using (true);

alter table customer_reviews enable row level security;
create policy "Public customer_reviews are viewable by everyone." on customer_reviews for select using (true);

