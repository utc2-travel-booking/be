## Search Image 
* Gợi í địa chỉ du lịch thông qua text,img
* data-base -> (img, textD, id_product)
- step 1 : img -> text -> text + textD -> vector
- step 2 : (id_product + vector) -> db

* data-search
- step 1: (img + textD) -> img -> text -> text + textD -> vector


* flow search :
- step 1: compare vector-input vs vector-db
- step 2: return data in db -> top(5) [id_product]

