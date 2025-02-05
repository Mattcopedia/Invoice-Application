export const htmlStyles = `
body {
  font-family: 'Verdana', sans-serif;
  margin-left: 30px; 
  margin-right: 30px;
  color:#332333;  
  font-weight: 400 !important; 
}
    
h2 {
padding-left: 22px;
  margin: 0; 
  padding-bottom:5px; 
  padding-top:5px; 
  color:#621416;
}  
 
.color {
font-weight: 400 !important;
}

.container {
  display: flex;
  flex-direction: row;
  justify-content: center;
} 

.align-text {
  line-height: 7px;  
  color:#271719;
}

h3 {
  color:#070202
}
   
.alignFactory {
  padding-left:20px;
  padding-bottom: 6px; 
}
 
img {
  width: 110px;
  height: 100px;
}

p {
  font-size: 14px; 
   color:#332333;  
}

.text {
  text-align: center;
}


/* Table css */ 
  .signature-image {
    max-width: 100%;
    width: 180px;
    height: 40px; /* Maintains aspect ratio */
    display: block; /* Ensures proper rendering */
    padding-right: 45px;
    padding-top: 10px;
  }

table {
  border-collapse: collapse;
  width: 100%;
  margin-top: 4px;
}

 td {
  border: 3px solid #fefef7; 
  background-color: #d4e0eb;
  padding: 8px;
  text-align: right;
  position: relative;
  text-align: left;
  font-size: 12px; 
}


 
th{
  padding: 2px;
  text-align: center;
  background-color: #324c63;
  border: 3px solid #fefef7;
  color: #f0f2f9; 
  font-size: 12px; 
}
 
 
th:nth-child(1), td:nth-child(1) {
  width: 25%;
}

th:nth-child(2), td:nth-child(2) {
  width: 25%;
}

th:nth-child(3), td:nth-child(3) {
  width: 50%;
}



.secondTable {
  border-collapse: collapse;
  width: 100%;
  margin-top: 40px;
  font-size: 12px;
}

.secondTable tbody tr td {
  border: 3px solid #fefef7;
  background-color: #d4e0eb;
  padding: 8px;
  text-align: right;
  position: relative;
  text-align: left;
  font-size: 12px; 
}
 

 
.secondTable tr th{
  padding: 2px;
  text-align: center;
  background-color: #324c63;
  border: 3px solid #fefef7;
  color: #f0f2f9;
}
 
 
.secondTable tr th:nth-child(1), .secondTable tbody tr td:nth-child(1) {
  width: 12.5%;
}

.secondTable tr th:nth-child(2),  .secondTable tbody tr td:nth-child(2) {
  width: 12.5%;
}

.secondTable tr th:nth-child(3),  .secondTable tbody tr td:nth-child(3) {
  width: 24%;
}

.secondTable tr th:nth-child(4),  .secondTable tbody tr td:nth-child(4) {
  width: 15%;
}

.secondTable tr th:nth-child(5),  .secondTable tbody tr td:nth-child(5) {
  width: 15%; 
}

.secondTable tr th:nth-child(6),  .secondTable tbody tr td:nth-child(6) {
  width: 21%;
}

.secondTable tbody tr .centerRow {
  text-align: center;
}

.secondTable tbody tr .alignRow {
 text-align: right; 

}


.secondTable tbody tr .alignRow34 {
  text-align: right; 
 }

.secondTable tbody tr .alignRowLeft {
  text-align: left; 
  padding-right:12px ;
}

.secondTable tbody tr .alignRowLeft2 span {
 padding-left: 62px;
}



.secondTable tbody tr .white {
  background-color: #ffffff; 
}

.secondTable tbody tr .brownText {
  background-color: #ffffff; 
  color: #6d7b95; 
  font-weight: bold;
  text-align: right;

}

.secondTable tbody tr .boldText {
  background-color: #d6e0ea; 
  color: #171d23; 
  font-weight: bold;
  text-align: left;
  border: none;
}


.secondTable tbody tr .boldText1 {
  background-color: #d6e0ea; 
  color: #171d23; 
  font-weight: bold;
  text-align: left;
  border-top: 2px solid #171d23;  

}




 .secondTable tbody tr .totalValue .row-align {
  display: flex;
  justify-content: space-between; 
  width: 100%;
  font-size: 12px; 
}

.secondTable tbody tr .totalValue .row-align span {
  text-align: left; 
}
 
.secondTable tbody tr .totalValue .row-align strong {
  text-align: right; 
}



.secondTable tbody tr .totalValue .row-align2 {
  display: flex;
  justify-content: space-between; 
  width: 100%;
  font-size: 12px; 
} 

.secondTable tbody tr .totalValue .row-align2 span {
  text-align: right; 

}
 
.secondTable tbody tr .totalValue .row-align2 p {
    text-align: left; 
}




.receiptheader { 
    display: flex;
    flex-direction: row;
  justify-content: space-between;
  align-items: flex-start; 
}

    
.image {
    padding: 10px;
    padding-left: 40px;
}
.receiptheader h1 {
    color: #456684;
    font-size: 60px;
    font-weight: bold;
    font-family: 'Verdana', sans-serif;  
    margin: 0;
    padding: 0;
    line-height: 1; 
    padding-top: 42px;
    padding-right: 7px;
}
 
.borderWall{
  display: flex;
  background-color:#466782 ;
  height: 5px;
 }   

 .borderWall2{
  display: flex;
  background-color:#466782 ;
  height: 5px; 
  margin: 0; 
  padding: 0;
 }   

 .receiptheader + .borderWall2 {
  margin-top: 0;   
}

.Sign {
  display: flex;
  align-items: center; /* Aligns items vertically */
  justify-content: flex-start; /* Ensures items are left-aligned */
  gap: 0; /* Removes any extra space between the elements */

}



.name {
  font-size: 12.5px; 
  line-height: 1.5; 
  border-top: 1px solid black; 
  width: 170px; 
  color: #44464f;
  text-align: center; 
} 
  
 .borderSig { 
  background-color:black ;
  height: 1px;
  width: 220px;
 } 






  .textSig p{
  font-weight: bold;
  color: #6c7780;
  font-size: 8px; 
  padding-left: 50px;
  text-align: center; 
  }

 .signature p {
  font-weight: bold;
  color: #44464f;
  font-size: 17px;
  padding-left: 50px;
 }
\
 .descriptionText {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  margin-bottom: 20px;  
 }
 .textDesc {
  line-height: 1;
 } 

 .textDesc h2 {
  color: #456684;
    font-size: 20px;  
    font-weight: bold;
    font-family: 'Verdana', sans-serif;  
 }
 .textDesc p {
  padding-left: 23px;
   color:#8c9b9f; 
 }
.dateDesc {
  padding-right: 80px;
  line-height: 1;
}
.dateDesc p span {
  color: #456684;
  font-weight: bold;
}
.dateDesc .moveInvoice {
  margin-right:0px;
}
.companyName {
  margin-left: 80px;
  margin-top: 4px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-bottom: 40px;
}
.companyName span {
  color: #456684;
  font-weight: bold;  
  padding-top: 15px;
}
.companyName p {
  line-height: 1.8;
}

.endText {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; 
  line-height: 0;
}
.endText p {
  text-align: center;
  color: #7e8e9c;
  font-weight: bold;
  font-size: 10px;
}

`