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

const Fakultas = () => {
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

  const getFakultas = async () => {
    const response = await Axios.get(`http://localhost:3000/fakultas`)
    const visible = {
      add: false,
      edit: {},
      delete: {},
    }
    await response.data.data.forEach((fakultas) => {
      visible.edit[fakultas.id] = false
      visible.delete[fakultas.id] = false
    })
    setVisible((prevVisible) => {
      return {
        ...prevVisible,
        ...visible,
      }
    })

    setData(
      response.data.data.map((fakultas) => {
        return {
          ...fakultas,
          action: (
            <CButtonGroup
              role="group"
              aria-label="Basic action"
              key={`action_button_${fakultas.id}`}
            >
              <CButton
                color="warning"
                onClick={() => {
                  setVisible((prevVisible) => ({
                    ...prevVisible,
                    edit: {
                      ...prevVisible.edit,
                      [fakultas.id]: true,
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
                      [fakultas.id]: true,
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

  const tambahFakultas = async () => {
    const response = await Axios.post(`http://localhost:3000/fakultas`, input)
    if (response.status === 201) {
      getFakultas()
      setVisible({
        ...visible,
        add: false,
      })
    }
  }

  const editFakultas = async (id) => {
    const response = await Axios.patch(`http://localhost:3000/fakultas/${id}`, input)
    if (response.status === 200) {
      getFakultas()
    }
  }

  const hapusFakultas = async (id) => {
    const response = await Axios.delete(`http://localhost:3000/fakultas/${id}`)
    if (response.status === 200) {
      getFakultas()
    }
  }

  useEffect(() => {
    getFakultas()
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
        Tambah Fakultas
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
          <CModalTitle>Tambah Fakultas Baru</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={tambahFakultas}>
          <CModalBody>
            <CFormInput
              classnama="mb-3"
              type="text"
              id="floatingnama"
              floatingLabel="Nama Fakultas"
              placeholder="Nama Fakultas"
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
              Tambah Fakultas Baru
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
      <DataTable columns={columns} data={data} pagination />

      {data.map((fakultas) => {
        return (
          <div key={fakultas.id}>
            <CModal
              visible={visible.edit[fakultas.id]}
              onClose={() => {
                setVisible((prevVisible) => ({
                  ...prevVisible,
                  edit: {
                    ...prevVisible.edit,
                    [fakultas.id]: false,
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
                      [fakultas.id]: true,
                    },
                  }))
                }}
              >
                <CModalTitle>Edit Fakultas</CModalTitle>
              </CModalHeader>
              <CForm onSubmit={() => editFakultas(fakultas.id)}>
                <CModalBody>
                  <CFormInput
                    classnama="mb-3"
                    type="text"
                    id="floatingnama"
                    floatingLabel="Nama Fakultas"
                    placeholder="Nama Fakultas"
                    onChange={(e) => {
                      setInput((inputPrev) => {
                        return {
                          ...inputPrev,
                          nama: e.target.value,
                        }
                      })
                    }}
                    defaultValue={fakultas.nama}
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
                          [fakultas.id]: false,
                        },
                      }))
                    }}
                  >
                    Tutup
                  </CButton>
                  <CButton color="primary" type="submit">
                    Edit Fakultas
                  </CButton>
                </CModalFooter>
              </CForm>
            </CModal>

            <CModal
              visible={visible.delete[fakultas.id]}
              onClose={() => {
                setVisible((prevVisible) => ({
                  ...prevVisible,
                  delete: {
                    ...prevVisible.delete,
                    [fakultas.id]: false,
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
                      [fakultas.id]: false,
                    },
                  }))
                }}
              >
                <CModalTitle>Delete Fakultas</CModalTitle>
              </CModalHeader>
              <CModalBody>Apakah kamu yakin ingin menghapus {fakultas.nama}?</CModalBody>
              <CModalFooter>
                <CButton
                  color="secondary"
                  onClick={() => {
                    setVisible((prevVisible) => ({
                      ...prevVisible,
                      delete: {
                        ...prevVisible.delete,
                        [fakultas.id]: false,
                      },
                    }))
                  }}
                >
                  Tutup
                </CButton>
                <CButton color="primary" onClick={() => hapusFakultas(fakultas.id)}>
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

export default Fakultas
