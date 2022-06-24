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

const Kursus = () => {
  const [columns, setColumns] = useState()
  const [data, setData] = useState([])
  const [visible, setVisible] = useState({
    add: false,
    edit: {},
    delete: {},
  })
  const [input, setInput] = useState({
    nama: '',
  })

  const getKursus = async () => {
    const response = await Axios.get(`http://localhost:3000/kursus`)
    const visible = {
      add: false,
      edit: {},
      delete: {},
    }
    await response.data.data.forEach((kursus) => {
      visible.edit[kursus.id] = false
      visible.delete[kursus.id] = false
    })
    setVisible((prevVisible) => {
      return {
        ...prevVisible,
        ...visible,
      }
    })

    setData(
      response.data.data.map((kursus) => {
        return {
          ...kursus,
          action: (
            <CButtonGroup role="group" aria-label="Basic action" key={`action_button_${kursus.id}`}>
              <CButton
                color="warning"
                onClick={() => {
                  setVisible((prevVisible) => ({
                    ...prevVisible,
                    edit: {
                      ...prevVisible.edit,
                      [kursus.id]: true,
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
                      [kursus.id]: true,
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

  const tambahKursus = async () => {
    const response = await Axios.post(`http://localhost:3000/kursus`, input)
    if (response.status === 201) {
      getKursus()
      setVisible({
        ...visible,
        add: false,
      })
    }
  }

  const editKursus = async (id) => {
    const response = await Axios.patch(`http://localhost:3000/kursus/${id}`, input)
    if (response.status === 200) {
      getKursus()
    }
  }

  const hapusKursus = async (id) => {
    const response = await Axios.delete(`http://localhost:3000/kursus/${id}`)
    if (response.status === 200) {
      getKursus()
    }
  }

  useEffect(() => {
    getKursus()
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
        Tambah Kursus
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
          <CModalTitle>Tambah Kursus Baru</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={tambahKursus}>
          <CModalBody>
            <CFormInput
              classnama="mb-3"
              type="text"
              id="floatingnama"
              floatingLabel="Nama Kursus"
              placeholder="Nama Kursus"
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
              Tambah Kursus Baru
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
      <DataTable columns={columns} data={data} pagination />

      {data.map((kursus) => {
        return (
          <div key={kursus.id}>
            <CModal
              visible={visible.edit[kursus.id]}
              onClose={() => {
                setVisible((prevVisible) => ({
                  ...prevVisible,
                  edit: {
                    ...prevVisible.edit,
                    [kursus.id]: false,
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
                      [kursus.id]: true,
                    },
                  }))
                }}
              >
                <CModalTitle>Edit Kursus</CModalTitle>
              </CModalHeader>
              <CForm onSubmit={() => editKursus(kursus.id)}>
                <CModalBody>
                  <CFormInput
                    classnama="mb-3"
                    type="text"
                    id="floatingnama"
                    floatingLabel="Nama Kursus"
                    placeholder="Nama Kursus"
                    onChange={(e) => {
                      setInput((inputPrev) => {
                        return {
                          ...inputPrev,
                          nama: e.target.value,
                        }
                      })
                    }}
                    defaultValue={kursus.nama}
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
                          [kursus.id]: false,
                        },
                      }))
                    }}
                  >
                    Tutup
                  </CButton>
                  <CButton color="primary" type="submit">
                    Edit Kursus
                  </CButton>
                </CModalFooter>
              </CForm>
            </CModal>

            <CModal
              visible={visible.delete[kursus.id]}
              onClose={() => {
                setVisible((prevVisible) => ({
                  ...prevVisible,
                  delete: {
                    ...prevVisible.delete,
                    [kursus.id]: false,
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
                      [kursus.id]: false,
                    },
                  }))
                }}
              >
                <CModalTitle>Delete Kursus</CModalTitle>
              </CModalHeader>
              <CModalBody>Apakah kamu yakin ingin menghapus {kursus.nama}?</CModalBody>
              <CModalFooter>
                <CButton
                  color="secondary"
                  onClick={() => {
                    setVisible((prevVisible) => ({
                      ...prevVisible,
                      delete: {
                        ...prevVisible.delete,
                        [kursus.id]: false,
                      },
                    }))
                  }}
                >
                  Tutup
                </CButton>
                <CButton color="primary" onClick={() => hapusKursus(kursus.id)}>
                  Delete Kursus
                </CButton>
              </CModalFooter>
            </CModal>
          </div>
        )
      })}
    </>
  )
}

export default Kursus
