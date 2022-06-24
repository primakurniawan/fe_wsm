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

const Subkriteria = () => {
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

  const getSubkriteria = async () => {
    const response = await Axios.get(`http://localhost:3000/subkriteria`)
    const visible = {
      add: false,
      edit: {},
      delete: {},
    }
    await response.data.data.forEach((subkriteria) => {
      visible.edit[subkriteria.id_subkriteria] = false
      visible.delete[subkriteria.id_subkriteria] = false
    })
    setVisible((prevVisible) => {
      return {
        ...prevVisible,
        ...visible,
      }
    })

    setData(
      response.data.data.map((subkriteria) => {
        return {
          ...subkriteria,
          action: (
            <CButtonGroup
              role="group"
              aria-label="Basic action"
              key={`action_button_${subkriteria.id_subkriteria}`}
            >
              <CButton
                color="warning"
                onClick={() => {
                  setVisible((prevVisible) => ({
                    ...prevVisible,
                    edit: {
                      ...prevVisible.edit,
                      [subkriteria.id_subkriteria]: true,
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
                      [subkriteria.id_subkriteria]: true,
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

  const tambahSubkriteria = async () => {
    const response = await Axios.post(`http://localhost:3000/subkriteria`, input)
    if (response.status === 201) {
      getSubkriteria()
      setVisible({
        ...visible,
        add: false,
      })
    }
  }

  const editSubkriteria = async (id) => {
    const response = await Axios.patch(`http://localhost:3000/subkriteria/${id}`, input)
    if (response.status === 200) {
      getSubkriteria()
    }
  }

  const hapusSubkriteria = async (id) => {
    const response = await Axios.delete(`http://localhost:3000/kriteria/${id}`)
    if (response.status === 200) {
      getSubkriteria()
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
    getSubkriteria()
    getKriteria()
  }, [])

  console.log(visible.edit)

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
        Tambah Subkriteria
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
          <CModalTitle>Tambah Subkriteria Baru</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={tambahSubkriteria}>
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
              floatingLabel="Nama Subkriteria"
              placeholder="Nama Subkriteria"
              onChange={(e) => {
                setInput({
                  ...input,
                  nama: e.target.value,
                })
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
              Tambah Subkriteria Baru
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
      <DataTable columns={columns} data={data} pagination />

      {data.map((subkriteria) => {
        return (
          <div key={subkriteria.id_subkriteria}>
            <CModal
              visible={visible.edit[subkriteria.id_subkriteria]}
              onClose={() => {
                setVisible((prevVisible) => ({
                  ...prevVisible,
                  edit: {
                    ...prevVisible.edit,
                    [subkriteria.id_subkriteria]: false,
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
                      [subkriteria.id_subkriteria]: true,
                    },
                  }))
                }}
              >
                <CModalTitle>Edit Subkriteria</CModalTitle>
              </CModalHeader>
              <CForm onSubmit={() => editSubkriteria(subkriteria.id_subkriteria)}>
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
                    defaultValue={subkriteria.id_kriteria}
                  />

                  <CFormInput
                    classnama="mb-3"
                    type="text"
                    id="floatingnama"
                    floatingLabel="Nama Subkriteria"
                    placeholder="Nama Subkriteria"
                    onChange={(e) => {
                      setInput((inputPrev) => {
                        return {
                          ...inputPrev,
                          nama: e.target.value,
                        }
                      })
                    }}
                    defaultValue={subkriteria.nama_subkriteria}
                    required
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
                          [subkriteria.id_subkriteria]: false,
                        },
                      }))
                    }}
                  >
                    Tutup
                  </CButton>
                  <CButton color="primary" type="submit">
                    Edit Subkriteria
                  </CButton>
                </CModalFooter>
              </CForm>
            </CModal>

            <CModal
              visible={visible.delete[subkriteria.id_subkriteria]}
              onClose={() => {
                setVisible((prevVisible) => ({
                  ...prevVisible,
                  delete: {
                    ...prevVisible.delete,
                    [subkriteria.id_subkriteria]: false,
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
                      [subkriteria.id_subkriteria]: false,
                    },
                  }))
                }}
              >
                <CModalTitle>Delete Subkriteria</CModalTitle>
              </CModalHeader>
              <CModalBody>Apakah kamu yakin ingin menghapus {subkriteria.nama}?</CModalBody>
              <CModalFooter>
                <CButton
                  color="secondary"
                  onClick={() => {
                    setVisible((prevVisible) => ({
                      ...prevVisible,
                      delete: {
                        ...prevVisible.delete,
                        [subkriteria.id_subkriteria]: false,
                      },
                    }))
                  }}
                >
                  Tutup
                </CButton>
                <CButton
                  color="primary"
                  onClick={() => hapusSubkriteria(subkriteria.id_subkriteria)}
                >
                  Delete Subkriteria
                </CButton>
              </CModalFooter>
            </CModal>
          </div>
        )
      })}
    </>
  )
}

export default Subkriteria
