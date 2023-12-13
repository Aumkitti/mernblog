import React from 'react'
import { Link } from 'react-router-dom'

const Post = () => {
  return (
    <div className='post'>
        <div className='image'>
            <Link>
                <img src="https://www.blognone.com/sites/default/files/externals/b6e92e34a7660b17840c7a959c673eb7.jpg" alt="" className='image' />
            </Link>
        </div>
        <div className="texts">
            <Link to='post/1'>
            <h2>
            ถึงแม้เป็นคู่แข่งกันโดยตรงในวงการสตรีมมิ่ง แต่เมื่อรายการไม่ได้ซ้อนทับกัน ดีลธุรกิจก็เกิดขึ้นได้เสมอ ล่าสุด Netflix เซ็นสัญญากับ Disney ซื้อไลเซนส์รายการในเครือ Disney รวม 14 รายการไปฉายบน Netflix ตามกรอบเวลา 18 เดือน
            </h2>
            </Link>
            <p className='info'>
                <a href="" className="author">Aum</a>
                <time>13 December 2023 - 11:26</time>
            </p>
            <p className="summary">
            ทิศทางของธุรกิจสตรีมมิ่งยุคก่อนหน้านี้ แข่งกันที่รายการเอ็กซ์คลูซีฟของแต่ละแพลตฟอร์มอย่างดุเดือด แต่เมื่อช่วงหลังการแข่งขันลดระดับความรุนแรงลง (บาดเจ็บกันทุกฝ่าย) บริษัทสตรีมมิ่งจึงกลับมาขายไลเซนส์รายการให้คู่แข่ง เพื่อหารายได้เสริมทางอื่นบ้าง แบบเดียวกับที่เคยทำกันในวงการสตรีมมิ่งยุคแรกๆ
            </p>
        </div>
    </div>
  )
}

export default Post
