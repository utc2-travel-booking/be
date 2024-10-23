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

git clone https://github.com/michaelfeil/infinity git checkout tags/0.0.52 cd
libs/infinity_emb

-   2 build download stage using docker buildx buildkit.

docker buildx build --target=production-with-download \
--build-arg MODEL_NAME=michaelfeil/bge-small-en-v1.5 --build-arg ENGINE=torch \
-f Dockerfile -t infinity-model-small .

-   3 write file docker-compose and run .

-   embedding from openai import OpenAI # pip install openai==1.51.0 client =
    OpenAI(base_url="http://localhost:7997/") client.embeddings.create(
    model="laion/larger_clap_general", input=[url_to_base64(url, "audio")], encoding_format="float",
    extra_body={ "modality": "audio" } )

client.embeddings.create( model="laion/larger_clap_general", input=["the
sound of a beep", "the sound of a cat"], encoding_format="base64", # base64: optional
high performance setting extra_body={ "modality": "text" } )
