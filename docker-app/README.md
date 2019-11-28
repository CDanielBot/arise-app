# Start

```
docker-compose up
```

# Starting only db

```
docker-compose up db
```

## Persistance

Database data will persist as long as the db docker container is **NOT** removed. You can even stop and restart and data will still persist.

## Starting with different dump

Put your dump in the `dumps` folder and change the reference in `docker-compose.yml` file in `db` section, under `volumes`

```
volumes:
 - "./dumps/[new_dump].sql:/docker-entrypoint-initdb.d/dump.sql"
```

## Exporting data

After starting everything up and playing around with actions that changed the data in the db and now you want that dump from the container, all you have to do is to export the dump from the container with the following command:

```
docker exec [container-id] /usr/bin/mysqldump -uroot -proot arise4c_devdb > backup.sql
```

## Dependencies

`docker`, `docker-compose`
