import { useEffect, useRef, useState } from 'react'
import DataTable from 'react-data-table-component'
import Axios from 'axios'
import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CFormSelect,
  CListGroup,
  CListGroupItem,
  CForm,
  CImage,
  CContainer,
  CCol,
  CRow,
} from '@coreui/react'

import '@coreui/coreui/dist/css/coreui.min.css'

const Rekomendasi = () => {
  const [data, setData] = useState([])
  const [rows, setRows] = useState([])
  const [columns, setColumns] = useState()
  const [subkriteriaDetail, setSubkriteriaDetail] = useState([])
  const [parameter, setParameter] = useState([])
  const [visible, setVisible] = useState(false)

  const [id_subkriteriaNilai, setId_subkriteriaNilai] = useState({})
  console.log('id_subkriteriaNilai', id_subkriteriaNilai)
  const form = useRef(null)

  const getRekomendasiJurusan = async () => {
    const response = await Axios.get(
      `http://localhost:3000/jurusan/rank?kriteria=${JSON.stringify(id_subkriteriaNilai)}`,
    )

    setVisible(false)

    setData((prevState) => response.data.data)

    setRows(
      response.data.data.map((jurusan) => {
        return {
          rank: jurusan.rank,
          id_jurusan: jurusan.id_jurusan,
          jurusan: jurusan.jurusan,
          id_fakultas: jurusan.id_fakultas,
          fakultas: jurusan.fakultas,
          skor: jurusan.skor,
        }
      }),
    )
  }

  const getSubkriteriaDetail = async () => {
    const response = await Axios.get(`http://localhost:3000/subkriteria/detail`)
    setSubkriteriaDetail(response.data.data)

    response.data.data.forEach((kriteria) => {
      kriteria.subkriteria.forEach((subkriteria) => {
        setId_subkriteriaNilai((prevState) => {
          return {
            ...prevState,
            [subkriteria.id_subkriteria]: 1,
          }
        })
      })
    })
  }

  const getParameter = async () => {
    const response = await Axios.get(`http://localhost:3000/parameter`)
    setParameter(response.data.data)
  }

  const expandableComponent = (rows) => (
    <CListGroup flush>
      {data
        .filter((e) => e.id_jurusan === rows.data.id_jurusan)[0]
        ?.kriteriaArray.map((k, i) => (
          <div key={i}>
            <h4 className="text-center">{k.kriteria}</h4>
            <CListGroup>
              {k.subkriteriaArray.map((s, i) => (
                <CListGroupItem key={i}>
                  {s.subkriteria}:{s.parameter}
                </CListGroupItem>
              ))}
            </CListGroup>
          </div>
        ))}
    </CListGroup>
  )

  useEffect(() => {
    getSubkriteriaDetail()
    getParameter()
  }, [])

  useEffect(() => {
    let columns = []
    if (rows.length > 0) {
      for (const [key] of Object.entries(rows[0])) {
        if (!key.includes('id_')) {
          columns.push({
            name: key.replace('_', ' ').toUpperCase(),
            selector: (row) => row[key],
            sortable: true,
          })
        }
      }
      setColumns(columns)
    }
  }, [rows])
  return (
    <CCol>
      <CContainer>
      <CRow>
        <div class="col-lg-6 d-flex flex-column justify-content-center pt-4 pt-lg-0 order-2 order-lg-1" data-aos="fade-up" data-aos-delay="200">
          <h4>REKOMENDASI PEMILIHAN JURUSAN</h4>
          <h6>Sistem Rekomendasi Pemilihan Jurusan di Universitas Sumatera Utara dan Rekomendasi Bimbingan Belajar</h6>
          <div class="d-flex justify-content-center justify-content-lg-start">
          <CButton
        onClick={() => {
          setVisible(true)
          getSubkriteriaDetail()
        }}
        color="success"
        className="mb-3 mt-3"
      >
        Cari Rekomendasi Jurusan
      </CButton>
             </div>
        </div>
        <div class="col-lg-6 order-1 order-lg-2 hero-img" data-aos="zoom-in" data-aos-delay="200">
          <img src="https://rawspace.sgp1.digitaloceanspaces.com/youniversity/university/93/universitas-sumatera-utara.jpg" class="img-fluid animated" alt=""></img>
        </div>
      </CRow>
      </CContainer>
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader onClose={() => setVisible(false)}>
          <CModalTitle>Cari Rekomendasi Jurusan</CModalTitle>
        </CModalHeader>
        <CForm ref={form} onSubmit={getRekomendasiJurusan}>
          <CModalBody>
            {subkriteriaDetail.map((kriteria, i) => {
              return (
                <div key={i}>
                  <h4 className="text-center">{kriteria.nama_kriteria}</h4>
                  {kriteria.subkriteria.map((subkriteria, i) => {
                    return (
                      <CFormSelect
                        className="mb-3"
                        size="sm"
                        label={subkriteria.nama_subkriteria}
                        key={subkriteria.id_subkriteria}
                        options={parameter
                          .filter((e) => e.id_kriteria === kriteria.id_kriteria)
                          .map((e) => {
                            return {
                              value: e.nilai_parameter,
                              label: e.nama_parameter,
                            }
                          })}
                        onChange={(e) => {
                          id_subkriteriaNilai[subkriteria.id_subkriteria] = parseInt(e.target.value)
                          setId_subkriteriaNilai((prevState) => ({
                            ...id_subkriteriaNilai,
                          }))
                        }}
                      />
                    )
                  })}
                </div>
              )
            })}
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible(false)}>
              Close
            </CButton>
            <CButton color="primary" type="submit">
              Cari Jurusan
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
      <DataTable
        columns={columns}
        data={rows}
        expandableRows
        expandableRowsComponent={expandableComponent}
        pagination
      />
    </CCol>
  )
}

export default Rekomendasi