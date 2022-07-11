import './App.css';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import React from 'react';
import axios from 'axios';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

pdfMake.fonts = {
  THSarabunNew: {
    normal: 'THSarabunNew.ttf',
    bold: 'THSarabunNew Bold.ttf',
    italics: 'THSarabunNew Italic.ttf',
    bolditalics: 'THSarabunNew BoldItalic.ttf'
  },
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf'
  }
}

const baseURL = `http://192.168.1.107:8080`

let ObjExample = {}
let repair_id = '1'
let repair_no = '0000000001'
let Token = ''

function App() {
  const [ObjTest, setObjTest] = React.useState(null);
  React.useEffect(() => {
    axios.get(baseURL + `/repair-pdf/${repair_id}`, {
      headers: {
        'Authorization': `Bearer ${Token}`
      }
    }).then((response) => {
      ObjExample = response.data
      setObjTest(response.data)
    })
  }, [])
  return (
    <div className="App">
      <h4>
        How to set up Thai font. (Thai Sarabun)
        <br /> 1. download fonts from <a href="https://github.com/sathittham/pdfmake-customfont/tree/main/examples/fonts">this url</a>
        <br /> 2. copy fonts file and create directory <i>examples/fonts</i> in node_modules/pdfmake/ to paste files
        <br /> 3. run command <i>npm install --global gulp-cli</i> then <i>npm install</i>
        <br /> 4. run command <i>npm run build:vfs</i> to build a file to use in pdf
        <br /> 5. copy line 4 to 21 above and set defaultStyle to THSarabunNew
      </h4>
      <p className="App-intro">
        PDF Generator
      </p>
      <p>
        <button onClick={printPDF}>
          Export PDF (Repair_id = {repair_id})
        </button>
      </p>
    </div>
  );
}

function printPDF() {
  const received_date = new Date(ObjExample.received_date)
  const return_date = new Date(ObjExample.return_date)

  const ThaiReceivedDate = received_date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })

  const ThaiReturnDate = return_date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })
  var docDefinition = {
    content: [
      { text: 'ใบรับซ่อมสินค้า', style: ['FontSize20', 'Bold', 'AlignCenter'] },
      { text: `${ObjExample.customer_firstname} ${ObjExample.customer_lastname}`, style: ['FontSize20', 'Bold'] },
      {
        columns: [
          {
            text: `${ObjExample.customer_house_no} ${ObjExample.customer_subdistrict} ${ObjExample.customer_district}
              ${ObjExample.customer_province} ${ObjExample.customer_zipcode}
              โทรศัพท์ ${ObjExample.customer_tel}`
          },
          {
            image: `${ObjExample.QRCode}`,
            width: 75,
            // margin: [left, top, right, bottom]
            margin: [-100, -10, 0, 0]
          }
        ]
      },
      `\n`,
      {
        columns: [
          `วันที่ทำรายการ : ${ThaiReceivedDate}`,
          `http://192.168.1.39:3000/repair-document/${ObjExample.repair_no} (เปลี่ยนเป็นหน้าfrontendรายละเอียดทีหลัง)`
        ]
      },
      {
        table: {
          headerRows: 1,
          widths: ['*', '*'],
          body: [
            [`ชื่อลูกค้า : ${ObjExample.customer_firstname} ${ObjExample.customer_lastname}`, `โทรศัพท์ :  ${ObjExample.customer_tel}`],
            [{ text: `ที่อยู่ : ${ObjExample.customer_house_no} ${ObjExample.customer_subdistrict} ${ObjExample.customer_district} ${ObjExample.customer_province} ${ObjExample.customer_zipcode}`, colSpan: 2 }],
            [`อุปกรณ์`, `หมายเลขเครื่อง ${ObjExample.product_serial_no}`],
            [{ text: `รายละเอียดการซ่อม/ปัญหา : ${(ObjExample.description != null) ? ObjExample.description : ''}`, colSpan: 2 }],
            [{ text: `หมายเหตุ : ${(ObjExample.remark != null) ? ObjExample.remark : ''}`, colSpan: 2 }],
            [{ text: `วันนัดรับ : ${ThaiReturnDate}`, colSpan: 2 }]
          ]
        }
      },
      `\n \n`,
      {
        columns: [
          { text: `.......................................................`, style: 'AlignCenter' },
          { text: `.......................................................`, style: 'AlignCenter' },
        ]
      },
      {
        columns: [
          { text: `ลูกค้า`, style: 'AlignCenter' },
          { text: `ผู้ปฏิบัติงาน`, style: 'AlignCenter' },
        ]
      },

    ],
    defaultStyle: {
      font: 'THSarabunNew',
      fontSize: 14
    },
    styles: {
      FontSize20: {
        fontSize: 20,
      },
      Bold: {
        bold: true,
      },
      AlignCenter: {
        alignment: 'center'
      },
      header: {
        fontSize: 22,
        bold: true
      },
      anotherStyle: {
        alignment: 'right'
      }
    }
  };
  pdfMake.createPdf(docDefinition).open()

}

export default App;
