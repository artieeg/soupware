#/bin/bash
docker exec -it soupware-media-nodes-1 redis-cli flushall
docker exec -it soupware-rooms-1 redis-cli flushall
docker exec -it soupware-recorder-pool-1 redis-cli flushall
