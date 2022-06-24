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
} from '@coreui/react'
import { useSelector } from 'react-redux'
import '@coreui/coreui/dist/css/coreui.min.css'

const Kriteria = () => {
  const [columns, setColumns] = useState()
  const [data, setData] = useState([])
  const [visible, setVisible] = useState({
    add: false,
    edit: {},
    delete: {},
  })
  const [input, setInput] = useState({
    nama: '',
    percentage: 0,
  })

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

    setData(
      response.data.data.map((kriteria) => {
        return {
          ...kriteria,
          action: (
            <CButtonGroup
              role="group"
              aria-label="Basic action"
              key={`action_button_${kriteria.id}`}
            >
              <CButton
                color="warning"
                onClick={() => {
                  setVisible((prevVisible) => ({
                    ...prevVisible,
                    edit: {
                      ...prevVisible.edit,
                      [kriteria.id]: true,
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
                      [kriteria.id]: true,
                    },
                  }))
                }}
              >
                Delete
              </CButton>
            </CButtonGroup>
          ),
        }
      }),
    )
  }

  const tambahKriteria = async () => {
    const response = await Axios.post(`http://localhost:3000/kriteria`, input)
    if (response.status === 201) {
      getKriteria()
      setVisible({
        ...visible,
        add: false,
      })
    }
  }

  const editKriteria = async (id) => {
    const response = await Axios.patch(`http://localhost:3000/kriteria/${id}`, input)
    if (response.status === 200) {
      getKriteria()
    }
  }

  const hapusKriteria = async (id) => {
    const response = await Axios.delete(`http://localhost:3000/kriteria/${id}`)
    if (response.status === 200) {
      getKriteria()
    }
  }

  useEffect(() => {
    getKriteria()
  }, [])

  useEffect(() => {
    let columns = []
    if (data.length > 0) {
      for (const [key] of Object.entries(data[0])) {
        if (!key.includes('_id') && key !== 'id') {
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
        Tambah Kriteria
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
          <CModalTitle>Tambah Kriteria Baru</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={tambahKriteria}>
          <CModalBody>
            <CFormInput
              classnama="mb-3"
              type="text"
              id="floatingnama"
              floatingLabel="Nama Kriteria"
              placeholder="Nama Kriteria"
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
              Tambah Kriteria Baru
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
      <DataTable columns={columns} data={data} pagination />

      {data.map((kriteria) => {
        return (
          <div key={kriteria.id}>
            <CModal
              visible={visible.edit[kriteria.id]}
              onClose={() => {
                setVisible((prevVisible) => ({
                  ...prevVisible,
                  edit: {
                    ...prevVisible.edit,
                    [kriteria.id]: false,
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
                      [kriteria.id]: true,
                    },
                  }))
                }}
              >
                <CModalTitle>Edit Kriteria</CModalTitle>
              </CModalHeader>
              <CForm onSubmit={() => editKriteria(kriteria.id)}>
                <CModalBody>
                  <CFormInput
                    classnama="mb-3"
                    type="text"
                    id="floatingnama"
                    floatingLabel="Nama Kriteria"
                    placeholder="Nama Kriteria"
                    onChange={(e) => {
                      setInput((inputPrev) => {
                        return {
                          ...inputPrev,
                          nama: e.target.value,
                        }
                      })
                    }}
                    defaultValue={kriteria.nama}
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
                          [kriteria.id]: false,
                        },
                      }))
                    }}
                  >
                    Tutup
                  </CButton>
                  <CButton color="primary" type="submit">
                    Edit Kriteria
                  </CButton>
                </CModalFooter>
              </CForm>
            </CModal>

            <CModal
              visible={visible.delete[kriteria.id]}
              onClose={() => {
                setVisible((prevVisible) => ({
                  ...prevVisible,
                  delete: {
                    ...prevVisible.delete,
                    [kriteria.id]: false,
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
                      [kriteria.id]: false,
                    },
                  }))
                }}
              >
                <CModalTitle>Delete Kriteria</CModalTitle>
              </CModalHeader>
              <CModalBody>Apakah kamu yakin ingin menghapus {kriteria.nama}?</CModalBody>
              <CModalFooter>
                <CButton
                  color="secondary"
                  onClick={() => {
                    setVisible((prevVisible) => ({
                      ...prevVisible,
                      delete: {
                        ...prevVisible.delete,
                        [kriteria.id]: false,
                      },
                    }))
                  }}
                >
                  Tutup
                </CButton>
                <CButton color="primary" onClick={() => hapusKriteria(kriteria.id)}>
                  Delete Fakultas
                </CButton>
              </CModalFooter>
            </CModal>
          </div>
        )
      })}
    </>
  )
}

export default Kriteria
