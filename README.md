## Search Image

-   Gợi í địa chỉ du lịch thông qua text,img
-   data-base -> (img, textD, id_product)

*   step 1 : img -> text -> text + textD -> vector
*   step 2 : (id_product + vector) -> db

-   data-search

*   step 1: (img + textD) -> img -> text -> text + textD -> vector

-   flow search :

*   step 1: compare vector-input vs vector-db
*   step 2: return data in db -> top(5) [id_product]

# embedding service

-   1 clone the repo

-   git clone https://github.com/michaelfeil/infinity libs/infinity_emb

-   2

port=7997  
model1=michaelfeil/bge-small-en-v1.5 model2=openai/clip-vit-base-patch32  
volume=$PWD/data

docker run -it --gpus all \
 -v $volume:/app/.cache \
 -p $port:$port \
 michaelf34/infinity:latest \  
 v2 \  
 --model-id $model1 \  
 --model-id $model2 \  
 --port $port
