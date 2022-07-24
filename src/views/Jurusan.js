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

const Jurusan = () => {
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
  const [visible, setVisible] = useState({
    add: false,
    edit: {},
    delete: {},
  })

  const [id_subkriteriaNilai, setId_subkriteriaNilai] = useState({})
  const form = useRef(null)

  const { selected } = useSelector((state) => state.categories)

  const getJurusan = async () => {
    const response = await Axios.get(`http://localhost:3000/jurusan`)
    const visible = {
      add: false,
      edit: {},
      delete: {},
    }
    await response.data.data.forEach((alternative) => {
      visible.edit[alternative.id_jurusan] = false
      visible.delete[alternative.id_jurusan] = false
    })
    setVisible((prevVisible) => {
      return {
        ...prevVisible,
        ...visible,
      }
    })

    setData((prevState) => response.data.data)

    setJurusan((prevState) => response.data.data)
    setRows(
      response.data.data.map((jurusan) => {
        return {
          id_jurusan: jurusan.id_jurusan,
          jurusan: jurusan.jurusan,
          id_fakultas: jurusan.id_fakultas,
          fakultas: jurusan.fakultas,
          action: (
            <div key={jurusan.id_jurusan}>
              <CButtonGroup role="group" aria-label="Basic action" key={jurusan.id_jurusan}>
                <CButton
                  color="warning"
                  onClick={() => {
                    setVisible((prevVisible) => ({
                      ...prevVisible,
                      edit: {
                        ...prevVisible.edit,
                        [jurusan.id_jurusan]: true,
                      },
                    }))
                    setNama(jurusan.jurusan)
                    const subkriteriaIdNilai = {}
                    jurusan.kriteriaArray.forEach((e) => {
                      e.subkriteriaArray.forEach((subkriteria) => {
                        subkriteriaIdNilai[subkriteria.id_subkriteria] = subkriteria.nilai
                      })
                    })
                    setId_subkriteriaNilai(subkriteriaIdNilai)
                  }}
                >
                  Edit
                </CButton>

                <CButton
                  color="danger"
                  onClick={() => {
                    setVisible((prevVisible) => ({
                      ...prevVisible,
                      delete: {
                        ...prevVisible.delete,
                        [jurusan.id_jurusan]: true,
                      },
                    }))
                  }}
                >
                  Delete
                </CButton>
              </CButtonGroup>
            </div>
          ),
        }
      }),
    )
  }

  const addJurusan = async (event) => {
    const response = await Axios.post(`http://localhost:3000/jurusan`, {
      nama,
      kriteria: id_subkriteriaNilai,
      id_fakultas,
    })
    if (response.status === 201) {
      getJurusan(selected)
    }
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

  const editJurusan = async (id) => {
    const obj = {
      nama,
      kriteria: id_subkriteriaNilai,
      id_fakultas,
    }
    console.log('obj', obj)
    const parameters_id = []
    for (const [, value] of Object.entries(id_subkriteriaNilai)) {
      parameters_id.push(value)
    }
    const response = await Axios.patch(`http://localhost:3000/jurusan/${id}`, {
      nama,
      kriteria: id_subkriteriaNilai,
      id_fakultas,
    })
    if (response.status === 200) {
      getJurusan(selected)
    }
  }

  const deleteJurusan = async (id) => {
    const response = await Axios.delete(`http://localhost:3000/jurusan/${id}`)
    if (response.status === 200) {
      getJurusan(selected)
    }
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
            <h2 className="text-center">{k.kriteria}</h2>
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
    getJurusan()
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
      <CButton
        onClick={() =>
          setVisible({
            ...visible,
            add: true,
          })
        }
        color="success"
        className="mb-3"
      >
        Tambah Jurusan
      </CButton>
      <CModal
        visible={visible.add}
        onClose={() =>
          setVisible({
            ...visible,
            add: false,
          })
        }
      >
        <CModalHeader
          onClose={() =>
            setVisible({
              ...visible,
              add: false,
            })
          }
        >
          <CModalTitle>Tambah Jurusan Baru</CModalTitle>
        </CModalHeader>
        <CForm ref={form} onSubmit={addJurusan}>
          <CModalBody>
            <CFormSelect
              className="mb-3"
              size="sm"
              label="Fakultas"
              options={fakultas.map((e) => {
                return {
                  value: e.id,
                  label: e.nama,
                }
              })}
              onChange={(e) => setId_fakultas((prevState) => parseInt(e.target.value))}
            />
            <CFormInput
              className="mb-3"
              type="text"
              id="floatingName"
              floatingLabel="Alternative name"
              placeholder="Name"
              onChange={(e) => setNama(e.target.value)}
              size="sm"
              required
            />
            {subkriteriaDetail.map((kriteria, i) => {
              return (
                <div key={i}>
                  <h2 className="text-center">{kriteria.nama_kriteria}</h2>
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
            <CButton
              color="secondary"
              onClick={() =>
                setVisible({
                  ...visible,
                  add: false,
                })
              }
            >
              Close
            </CButton>
            <CButton color="primary" type="submit">
              Add New Alternative
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

      {jurusan.map((jurusan) => {
        return (
          <div key={jurusan.id_jurusan}>
            <CModal
              visible={visible.edit[jurusan.id_jurusan]}
              onClose={() =>
                setVisible((prevVisible) => ({
                  ...prevVisible,
                  edit: {
                    ...prevVisible.edit,
                    [jurusan.id_jurusan]: false,
                  },
                }))
              }
            >
              <CModalHeader
                onClose={() =>
                  setVisible((prevVisible) => ({
                    ...prevVisible,
                    edit: {
                      ...prevVisible.edit,
                      [jurusan.id_jurusan]: false,
                    },
                  }))
                }
              >
                <CModalTitle>Edit Jurusan</CModalTitle>
              </CModalHeader>
              <CForm onSubmit={() => editJurusan(jurusan.id_jurusan)}>
                <CModalBody>
                  <CFormSelect
                    className="mb-3"
                    size="sm"
                    label="Fakultas"
                    options={fakultas.map((e) => {
                      return {
                        value: e.id,
                        label: e.nama,
                      }
                    })}
                    onChange={(e) => setId_fakultas((prevState) => parseInt(e.target.value))}
                    defaultValue={jurusan.id_fakultas}
                  />
                  <CFormInput
                    className="mb-3"
                    type="text"
                    id="floatingName"
                    floatingLabel="Alternative name"
                    placeholder="Name"
                    onChange={(e) => setNama(e.target.value)}
                    size="sm"
                    required
                    defaultValue={jurusan.jurusan}
                  />
                  {subkriteriaDetail.map((kriteria, i) => {
                    return (
                      <div key={i}>
                        <h2 className="text-center">{kriteria.nama_kriteria}</h2>
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
                              defaultValue={
                                jurusan.kriteriaArray
                                  .filter((e) => e.id_kriteria === kriteria.id_kriteria)[0]
                                  ?.subkriteriaArray.filter(
                                    (e) => e.id_subkriteria === subkriteria.id_subkriteria,
                                  )[0]?.nilai
                              }
                            />
                          )
                        })}
                      </div>
                    )
                  })}
                </CModalBody>
                <CModalFooter>
                  <CButton
                    color="secondary"
                    onClick={() =>
                      setVisible((prevVisible) => ({
                        ...prevVisible,
                        edit: {
                          ...prevVisible.edit,
                          [jurusan.id_jurusan]: false,
                        },
                      }))
                    }
                  >
                    Close
                  </CButton>
                  <CButton color="primary" type="submit">
                    Edit Jurusan
                  </CButton>
                </CModalFooter>
              </CForm>
            </CModal>

            <CModal
              visible={visible.delete[jurusan.id_jurusan]}
              onClose={() =>
                setVisible((prevVisible) => ({
                  ...prevVisible,
                  delete: {
                    ...prevVisible.delete,
                    [jurusan.id_jurusan]: false,
                  },
                }))
              }
            >
              <CModalHeader
                onClose={() =>
                  setVisible((prevVisible) => ({
                    ...prevVisible,
                    delete: {
                      ...prevVisible.delete,
                      [jurusan.id_jurusan]: false,
                    },
                  }))
                }
              >
                <CModalTitle>Delete Alternative</CModalTitle>
              </CModalHeader>
              <CModalBody>Are you sure you want to delete {jurusan.name}?</CModalBody>
              <CModalFooter>
                <CButton
                  color="secondary"
                  onClick={() =>
                    setVisible((prevVisible) => ({
                      ...prevVisible,
                      delete: {
                        ...prevVisible.delete,
                        [jurusan.id_jurusan]: false,
                      },
                    }))
                  }
                >
                  Close
                </CButton>
                <CButton color="primary" onClick={deleteJurusan.bind(this, jurusan.id_jurusan)}>
                  Delete Alternative
                </CButton>
              </CModalFooter>
            </CModal>
          </div>
        )
      })}
    </>
  )
}

export default Jurusan
