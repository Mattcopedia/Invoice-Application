export const refurbishStyles = `
body {
  font-family: 'Calibri', "sans-serif"; 
  margin-left: 30px; 
  margin-right: 30px;
  color:#332333;  
  font-weight: 400 !important;  
}

.page-content {
  display: block;
  page-break-inside: avoid; /* Prevent breaking inside this container */
  page-break-before: auto; /* Automatically break before if necessary */
  page-break-after: auto; /* Automatically break after if necessary */
}

.page-content:last-of-type {
  page-break-after: avoid; /* Prevent unnecessary blank pages */
} 
    
h2 {
padding-left: 22px;
  margin: 0;
  padding-bottom:5px;
  padding-top:5px; 
  color:#621416
}  
 
.color {
font-weight: 400 !important;
}

.container {
  display: flex;
  flex-direction: row;
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
  margin-left: 30px;
}

#shiftImage {
  margin-top: 16px;
  padding-left: 30px; 
} 

.descriptionContainer {
  display: flex;
  flex-direction: row;
  justify-content: space-between; 

}

.description { 
  line-height: 11px;
  padding-left: 1px;  
}

.date {
  margin-right: 17px; 
  line-height: 11px;  
}

.Telphone {
margin-left:10px;
padding-left:10px;
}


/* Table css */

table {
  border-collapse: collapse;
  width: 100%; 
  border: 3px solid black; 
}

 td {
  border: 2px solid black;
//   padding: 8px;
  text-align: right;
  position: relative;
}

.outside-number {
  position: absolute;
  left: -16px; 
  top: 50%;  
  font-weight: bold;
  transform: translateY(-50%); 
}

.page-break {
 page-break-after: always; 
}     

.page-breakFinal {
  page-break-before: always;  
 }     

 .borderWall{
  border-right: 3px solid black; 
  border-left: 3px solid black;
 }  

 .borderAround {
  border: 3px solid black;  
 }
 
th{
  border: 2px solid black;
  text-align: center;
}
 
tr {
  page-break-inside: avoid; /* Prevent page break inside table rows */
}

 
th:nth-child(1), td:nth-child(1) {
  width: 20%;
}

th:nth-child(2), td:nth-child(2) {
  width: 39%;
}

th:nth-child(3), td:nth-child(3) {
  width: 3%;
}

th:nth-child(4), td:nth-child(4) {
  width: 18%;
}
 
th:nth-child(5), td:nth-child(5) {
  width: 17%; 
}

tfoot .total {
  text-align: right;
  font-weight: bold;
  text-align: left;
}

.total-amount {
  font-weight: bold;
}

.space {
  background-color: #bfbfbf;
 padding: 0.1em; 
 border: 2px solid black; 
} 

.spacerefurb {
    background-color: #bfbfbf;
   padding: 0.1em; 
   border: 2px solid black; 
   font-weight: bold;
   text-align: center;
   color:black !important
  } 

 .spacerefurb h2 {
   color:black !important
 }

 .upSpace {
 height: 73px;
 } 

.furniture {
  width: 250px;
  height: 250px;
}

.center {
  text-align: center;
}
.right {
  text-align: right;
}

.left {
  margin-left: 10px;
  text-align: left;
}

.totalbody {
  text-align: left;
  font-weight: bold;
}
.totalbodybold {
  text-align: left;
  font-weight: bolder;
  font-size: larger;
}
.totalbodyPad { 
  text-align: left;
  font-weight: bold;
  margin-right: 100px; 
}
.totalbodyUp {
  margin-top: 20px; 
}
.total-amountGrand {
  font-weight: bolder;
  font-size: 21.5px;
}

`;