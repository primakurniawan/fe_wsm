import React, { useCallback, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import Axios from 'axios'
import {
  CButton,
  CButtonGroup,
  CForm,
  CFormInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CFormSelect,
} from '@coreui/react'
import { useSelector } from 'react-redux'
import '@coreui/coreui/dist/css/coreui.min.css'

const Parameter = () => {
  const [columns, setColumns] = useState()
  const [data, setData] = useState([])
  const [kriteria, setKriteria] = useState([])
  const [visible, setVisible] = useState({
    add: false,
    edit: {},
    delete: {},
  })
  const [input, setInput] = useState({
    nama: '',
    percentage: 0,
  })

  const getParameter = async () => {
    const response = await Axios.get(`http://localhost:3000/parameter`)
    const visible = {
      add: false,
      edit: {},
      delete: {},
    }
    await response.data.data.forEach((parameter) => {
      visible.edit[parameter.id_parameter] = false
      visible.delete[parameter.id_parameter] = false
    })
    setVisible((prevVisible) => {
      return {
        ...prevVisible,
        ...visible,
      }
    })

    setData(
      response.data.data.map((parameter) => {
        return {
          ...parameter,
          action: (
            <CButtonGroup
              role="group"
              aria-label="Basic action"
              key={`action_button_${parameter.id_parameter}`}
            >
              <CButton
                color="warning"
                onClick={() => {
                  setVisible((prevVisible) => ({
                    ...prevVisible,
                    edit: {
                      ...prevVisible.edit,
                      [parameter.id_parameter]: true,
                    },
                  }))
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
                      [parameter.id_parameter]: true,
                    },
                  }))
                }}
              >
                Hapus
              </CButton>
            </CButtonGroup>
          ),
        }
      }),
    )
  }

  const tambahParameter = async () => {
    const response = await Axios.post(`http://localhost:3000/parameter`, input)
    if (response.status === 201) {
      getParameter()
      setVisible({
        ...visible,
        add: false,
      })
    }
  }

  const editParameter = async (id) => {
    const response = await Axios.patch(`http://localhost:3000/parameter/${id}`, input)
    if (response.status === 200) {
      getParameter()
    }
  }

  const hapusParameter = async (id) => {
    const response = await Axios.delete(`http://localhost:3000/parameter/${id}`)
    if (response.status === 200) {
      getParameter()
    }
  }

  const getKriteria = async () => {
    const response = await Axios.get(`http://localhost:3000/kriteria`)
    const visible = {
      add: false,
      edit: {},
      delete: {},
    }
    await response.data.data.forEach((kriteria) => {
      visible.edit[kriteria.id] = false
      visible.delete[kriteria.id] = false
    })
    setVisible((prevVisible) => {
      return {
        ...prevVisible,
        ...visible,
      }
    })

    setKriteria(response.data.data)
  }

  useEffect(() => {
    getParameter()
    getKriteria()
  }, [])

  useEffect(() => {
    let columns = []
    if (data.length > 0) {
      for (const [key] of Object.entries(data[0])) {
        if (!key.includes('id_') && key !== 'id') {
          columns.push({
            name: key.replace('_', ' ').toUpperCase(),
            selector: (row) => row[key],
            sortable: true,
          })
        }
      }
      setColumns(columns)
    }
  }, [data])

  return (
    <>
      <CButton
        onClick={() => {
          setVisible({
            ...visible,
            add: true,
          })
        }}
        color="success"
        classnama="mb-3"
      >
        Tambah Parameter
      </CButton>
      <CModal
        visible={visible.add}
        onClose={() => {
          setVisible({
            ...visible,
            add: false,
          })
        }}
      >
        <CModalHeader
          onClose={() => {
            setVisible({
              ...visible,
              add: false,
            })
          }}
        >
          <CModalTitle>Tambah Parameter Baru</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={tambahParameter}>
          <CModalBody>
            <CFormSelect
              className="mb-3"
              label="Kriteria"
              options={kriteria.map((e) => ({
                value: e.id,
                label: e.nama,
              }))}
              onChange={(e) => {
                setInput((prevInput) => ({
                  ...prevInput,
                  id_kriteria: parseInt(e.target.value),
                }))
              }}
            />

            <CFormInput
              classnama="mb-3"
              type="text"
              id="floatingnama"
              floatingLabel="Nama Parameter"
              placeholder="Nama Parameter"
              onChange={(e) => {
                setInput({
                  ...input,
                  nama: e.target.value,
                })
              }}
              required
            />

            <CFormInput
              className="mb-3"
              type="number"
              id="floatingPercentage"
              floatingLabel="Nilai Parameter"
              placeholder="Nilai Parameter"
              min={1}
              max={5}
              onChange={(e) => {
                setInput((prevInput) => ({
                  ...prevInput,
                  nilai: parseInt(e.target.value),
                }))
              }}
              required
            />
          </CModalBody>
          <CModalFooter>
            <CButton
              color="secondary"
              onClick={() => {
                setVisible({
                  ...visible,
                  add: false,
                })
              }}
            >
              Tutup
            </CButton>
            <CButton color="primary" type="submit">
              Tambah Parameter Baru
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
      <DataTable columns={columns} data={data} pagination />

      {data.map((parameter) => {
        return (
          <div key={parameter.id_parameter}>
            <CModal
              visible={visible.edit[parameter.id_parameter]}
              onClose={() => {
                setVisible((prevVisible) => ({
                  ...prevVisible,
                  edit: {
                    ...prevVisible.edit,
                    [parameter.id_parameter]: false,
                  },
                }))
              }}
            >
              <CModalHeader
                onClose={() => {
                  setVisible((prevVisible) => ({
                    ...prevVisible,
                    edit: {
                      ...prevVisible.edit,
                      [parameter.id_parameter]: true,
                    },
                  }))
                }}
              >
                <CModalTitle>Edit Parameter</CModalTitle>
              </CModalHeader>
              <CForm onSubmit={() => editParameter(parameter.id_parameter)}>
                <CModalBody>
                  <CFormSelect
                    className="mb-3"
                    label="Kriteria"
                    options={kriteria.map((e) => ({
                      value: e.id,
                      label: e.nama,
                    }))}
                    onChange={(e) => {
                      setInput((prevInput) => ({
                        ...prevInput,
                        id_kriteria: parseInt(e.target.value),
                      }))
                    }}
                    defaultValue={parameter.id_kriteria}
                  />

                  <CFormInput
                    classnama="mb-3"
                    type="text"
                    id="floatingnama"
                    floatingLabel="Nama Parameter"
                    placeholder="Nama Parameter"
                    onChange={(e) => {
                      setInput((inputPrev) => {
                        return {
                          ...inputPrev,
                          nama: e.target.value,
                        }
                      })
                    }}
                    defaultValue={parameter.nama_parameter}
                    required
                  />

                  <CFormInput
                    className="mb-3"
                    type="number"
                    id="floatingPercentage"
                    floatingLabel="Nilai Parameter"
                    placeholder="Nilai Parameter"
                    min={1}
                    max={5}
                    onChange={(e) => {
                      setInput((prevInput) => ({
                        ...prevInput,
                        nilai: parseInt(e.target.value),
                      }))
                    }}
                    required
                    defaultValue={parameter.nilai_parameter}
                  />
                </CModalBody>
                <CModalFooter>
                  <CButton
                    color="secondary"
                    onClick={() => {
                      setVisible((prevVisible) => ({
                        ...prevVisible,
                        edit: {
                          ...prevVisible.edit,
                          [parameter.id_parameter]: false,
                        },
                      }))
                    }}
                  >
                    Tutup
                  </CButton>
                  <CButton color="primary" type="submit">
                    Edit Parameter
                  </CButton>
                </CModalFooter>
              </CForm>
            </CModal>

            <CModal
              visible={visible.delete[parameter.id_parameter]}
              onClose={() => {
                setVisible((prevVisible) => ({
                  ...prevVisible,
                  delete: {
                    ...prevVisible.delete,
                    [parameter.id_parameter]: false,
                  },
                }))
              }}
            >
              <CModalHeader
                onClose={() => {
                  setVisible((prevVisible) => ({
                    ...prevVisible,
                    delete: {
                      ...prevVisible.delete,
                      [parameter.id_parameter]: false,
                    },
                  }))
                }}
              >
                <CModalTitle>Hapus Parameter</CModalTitle>
              </CModalHeader>
              <CModalBody>Apakah kamu yakin ingin menghapus {parameter.nama_parameter}?</CModalBody>
              <CModalFooter>
                <CButton
                  color="secondary"
                  onClick={() => {
                    setVisible((prevVisible) => ({
                      ...prevVisible,
                      delete: {
                        ...prevVisible.delete,
                        [parameter.id_parameter]: false,
                      },
                    }))
                  }}
                >
                  Tutup
                </CButton>
                <CButton color="primary" onClick={() => hapusParameter(parameter.id_parameter)}>
                  Hapus Parameter
                </CButton>
              </CModalFooter>
            </CModal>
          </div>
        )
      })}
    </>
  )
}

export default Parameter
