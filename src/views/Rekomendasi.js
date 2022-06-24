import { useEffect, useRef, useState } from 'react'
import DataTable from 'react-data-table-component'
import Axios from 'axios'
import {
  CButton,
  CButtonGroup,
  CFormInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CFormSelect,
  CListGroup,
  CListGroupItem,
  CForm,
} from '@coreui/react'
const { useSelector } = require('react-redux')

import '@coreui/coreui/dist/css/coreui.min.css'

const Rekomendasi = () => {
  const [data, setData] = useState([])
  const [rows, setRows] = useState([])
  const [jurusan, setJurusan] = useState([])
  const [columns, setColumns] = useState()
  const [fakultas, setFakultas] = useState([])
  const [id_fakultas, setId_fakultas] = useState(0)
  const [nama, setNama] = useState('')
  const [subkriteria, setSubkriteria] = useState([])
  const [subkriteriaDetail, setSubkriteriaDetail] = useState([])
  const [parameter, setParameter] = useState([])
  const [parametersDetail, setParametersDetail] = useState([])
  const [visible, setVisible] = useState(false)

  const [id_subkriteriaNilai, setId_subkriteriaNilai] = useState({})
  const form = useRef(null)

  const { selected } = useSelector((state) => state.categories)

  const getRekomendasiJurusan = async () => {
    const response = await Axios.get(
      `http://localhost:3000/jurusan/rank?kriteria=${JSON.stringify(id_subkriteriaNilai)}`,
    )

    setVisible(false)

    setData((prevState) => response.data.data)

    setJurusan((prevState) => response.data.data)
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

  const getSubkriteria = async () => {
    const response = await Axios.get(`http://localhost:3000/subkriteria`)
    // console.log(response.data.data)
    setSubkriteria(response.data.data)
    const subkriteriaIdNilai = {}
    response.data.data.forEach((e) => {
      subkriteriaIdNilai[e.id_subkriteria] = 1
    })
    setId_subkriteriaNilai(subkriteriaIdNilai)
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

  const getFakultas = async () => {
    const response = await Axios.get(`http://localhost:3000/fakultas`)
    setFakultas(response.data.data)
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
    getSubkriteria()
    getSubkriteriaDetail()
    getParameter()
    getFakultas()
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
    <>
      <CButton onClick={() => setVisible(true)} color="success" className="mb-3">
        Cari Rekomendasi Jurusan
      </CButton>
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
                        onChange={(e) =>
                          setId_subkriteriaNilai((prevState) => ({
                            ...prevState,
                            [subkriteria.id_subkriteria]: parseInt(e.target.value),
                          }))
                        }
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
    </>
  )
}

export default Rekomendasi
