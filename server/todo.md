## crud on : - 
- ### `products` 
- ### `services` 
- ### `requirements` 
- ### `wastes`

## frp treatments 
    ```
    what are the main treatments beign offered?
    who is providing that particular treatment?
    which treatments are available on said frp?
     ```

## service providers
    ```
    1. list all service providers
    2. what does each service provider provide
    3. meta data of every service offered by service provider
    ```

## collection point
    1. list all registered collection points
    2. geo locate all the collection points
    3. additional data available with collector, deal with that

---
---
---

# crud
# 1. products                                                   done
        POST   /products
        GET    /products
        GET    /products/:productId
        GET    /products/user/:userId
        GET    /products/frp/:frpId
        GET    /products?composition=&frp=
        PUT    /products/:productId
        DELETE /products/:productId
        

# 2. wastes                                                     done
        POST   /wastes
        GET    /wastes
        GET    /wastes/:wasteId
        GET    /wastes/user/:userId
        GET    /wastes/frp/:frpId
        GET    /wastes?category=&grade=&status=&collector=
        PUT    /wastes/:wasteId
        DELETE /wastes/:wasteId

# 3. requirements                                               done
        POST   /requirements
        GET    /requirements
        GET    /requirements/:requirementId
        GET    /requirements/user/:userId
        GET    /requirements?category=&grade=&status=
        PUT    /requirements/:requirementId
        DELETE /requirements/:requirementId

# 4. services                                                   done
        POST   /recycle-process
        GET    /recycle-process?frp=&capacity=&charges=&method=
        GET    /recycle-process/:processId
        GET    /recycle-process/recycler/:recyclerId
        PATCH  /recycle-process/:processId
        DELETE /recycle-process/:processId


# frp                                                           done
    GET /frp
    GET /frp?composition=&category=&grade=&resin=

# manufacturing process                                         done
    POST   /manufacturing-processes
    GET    /manufacturing-processes                        — all system defaults (user_id = null)
    GET    /manufacturing-processes/:mpId
    GET    /manufacturing-processes/user/:userId           — all processes created by a manufacturer
    PATCH  /manufacturing-processes/:mpId
    DELETE /manufacturing-processes/:mpId

# recyclers                                                     done

    POST   /recyclers/register
    GET    /recyclers                          
    GET    /recyclers/:recyclerId
    GET    /recyclers?frp=&capacity=&charges=&treatment_process=


# treatment_processes                                           done
    POST   /treatment-processes
    GET    /treatment-processes
    GET    /treatment-processes/:tpId
    GET    /treatment-processes/recycler/:recyclerId
    PATCH  /treatment-processes/:tpId
    DELETE /treatment-processes/:tpId

# treatments                                                    done
    POST   /treatments
    GET    /treatments
    GET    /treatments/:treatmentId
    GET    /treatments/recycler/:recyclerId
    GET    /treatments?frp=&method=
    PATCH  /treatments/:treatmentId
    DELETE /treatments/:treatmentId


# collectors                                                    done
    POST   /collectors/register
    GET    /collectors
    GET    /collectors/:collectorId
    GET    /collectors?lat=&lng=&radius=        — geo proximity search
    PATCH  /collectors/:collectorId
    DELETE /collectors/:collectorId


# collector_sources (waste generators using this collection point)  done
    POST   /collector-sources
    GET    /collector-sources/collector/:collectorId
    DELETE /collector-sources/:sourceId

# collector_consumers (recyclers picking up from this collection point) done
    POST   /collector-consumers
    GET    /collector-consumers/collector/:collectorId
    DELETE /collector-consumers/:consumerId