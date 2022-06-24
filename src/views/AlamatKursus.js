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
import '@coreui/coreui/dist/css/coreui.min.css'

const Subkriteria = () => {
  const [columns, setColumns] = useState()
  const [data, setData] = useState([])
  const [kursus, setKursus] = useState([])
  console.log(kursus)
  const [visible, setVisible] = useState({
    add: false,
    edit: {},
    delete: {},
  })

  const [input, setInput] = useState({
    id_kursus: 0,
    nama: '',
    alamat: '',
    lon: 0.0,
    lat: 0.0,
  })

  console.log(input)
  const getAlamatKursus = async () => {
    const response = await Axios.get(`http://localhost:3000/alamat`)
    const visible = {
      add: false,
      edit: {},
      delete: {},
    }
    await response.data.data.forEach((alamatKursus) => {
      visible.edit[alamatKursus.id_alamat_kursus] = false
      visible.delete[alamatKursus.id_alamat_kursus] = false
    })
    setVisible((prevVisible) => {
      return {
        ...prevVisible,
        ...visible,
      }
    })

    setData(
      response.data.data.map((alamatKursus) => {
        return {
          ...alamatKursus,
          action: (
            <CButtonGroup
              role="group"
              aria-label="Basic action"
              key={`action_button_${alamatKursus.id_alamat_kursus}`}
            >
              <CButton
                color="warning"
                onClick={() => {
                  setVisible((prevVisible) => ({
                    ...prevVisible,
                    edit: {
                      ...prevVisible.edit,
                      [alamatKursus.id_alamat_kursus]: true,
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
                      [alamatKursus.id_alamat_kursus]: true,
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

  const tambahAlamatKursus = async () => {
    const response = await Axios.post(`http://localhost:3000/alamat`, input)
    if (response.status === 201) {
      getAlamatKursus()
      setVisible({
        ...visible,
        add: false,
      })
    }
  }

  const editAlamatKursus = async (id) => {
    const response = await Axios.patch(`http://localhost:3000/alamat/${id}`, input)
    if (response.status === 200) {
      getAlamatKursus()
    }
  }

  const hapusAlamatKursus = async (id) => {
    const response = await Axios.delete(`http://localhost:3000/alamat/${id}`)
    if (response.status === 200) {
      getAlamatKursus()
    }
  }

  const getKursus = async () => {
    const response = await Axios.get(`http://localhost:3000/kursus`)

    setKursus(response.data.data)
  }

  useEffect(() => {
    getAlamatKursus()
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
        Tambah Alamat Kursus
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
          <CModalTitle>Tambah Alamat Kursus Baru</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={tambahAlamatKursus}>
          <CModalBody>
            <CFormSelect
              className="mb-3"
              label="Kursus"
              options={kursus.map((e) => ({
                value: e.id,
                label: e.nama,
              }))}
              onChange={(e) => {
                setInput((prevInput) => ({
                  ...prevInput,
                  id_kursus: parseInt(e.target.value),
                }))
              }}
            />

            <CFormInput
              classnama="mb-3"
              type="text"
              id="floatingnama"
              floatingLabel="Nama Alamat Kursus"
              placeholder="Nama Alamat Kursus"
              onChange={(e) => {
                setInput({
                  ...input,
                  nama: e.target.value,
                })
              }}
              required
            />

            <CFormInput
              classnama="mb-3"
              type="text"
              id="floatingnama"
              floatingLabel="Alamat Kursus"
              placeholder="Alamat Kursus"
              onChange={(e) => {
                setInput({
                  ...input,
                  alamat: e.target.value,
                })
              }}
              required
            />

            <CFormInput
              classnama="mb-3"
              type="number"
              step="any"
              id="floatingnama"
              floatingLabel="lon"
              placeholder="lon"
              onChange={(e) => {
                setInput({
                  ...input,
                  lon: parseFloat(e.target.value),
                })
              }}
              min={-180}
              max={180}
              required
            />
            <CFormInput
              classnama="mb-3"
              type="number"
              step="any"
              id="floatingnama"
              floatingLabel="lat"
              placeholder="lat"
              onChange={(e) => {
                setInput({
                  ...input,
                  lat: parseFloat(e.target.value),
                })
              }}
              required
              min={-90}
              max={90}
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
              Tambah Alamat Kursus Baru
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
      <DataTable columns={columns} data={data} pagination />

      {data.map((alamatKursus) => {
        return (
          <div key={alamatKursus.id_alamat_kursus}>
            <CModal
              visible={visible.edit[alamatKursus.id_alamat_kursus]}
              onClose={() => {
                setVisible((prevVisible) => ({
                  ...prevVisible,
                  edit: {
                    ...prevVisible.edit,
                    [alamatKursus.id_alamat_kursus]: false,
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
                      [alamatKursus.id_alamat_kursus]: true,
                    },
                  }))
                }}
              >
                <CModalTitle>Edit Alamat Kursus</CModalTitle>
              </CModalHeader>
              <CForm onSubmit={() => editAlamatKursus(alamatKursus.id_alamat_kursus)}>
                <CModalBody>
                  <CFormSelect
                    className="mb-3"
                    label="Kriteria"
                    options={kursus.map((e) => ({
                      value: e.id,
                      label: e.nama,
                    }))}
                    onChange={(e) => {
                      setInput((prevInput) => ({
                        ...prevInput,
                        id_kursus: parseInt(e.target.value),
                      }))
                    }}
                    defaultValue={alamatKursus.id_kursus}
                  />

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
                    defaultValue={alamatKursus.nama_kursus}
                    required
                  />

                  <CFormInput
                    classnama="mb-3"
                    type="text"
                    id="floatingnama"
                    floatingLabel="Alamat Kursus"
                    placeholder="Alamat Kursus"
                    onChange={(e) => {
                      setInput({
                        ...input,
                        alamat: e.target.value,
                      })
                    }}
                    required
                    defaultValue={alamatKursus.nama_alamat_kursus}
                  />

                  <CFormInput
                    classnama="mb-3"
                    type="number"
                    step="any"
                    id="floatingnama"
                    floatingLabel="lon"
                    placeholder="lon"
                    onChange={(e) => {
                      setInput({
                        ...input,
                        lon: parseFloat(e.target.value),
                      })
                    }}
                    min={-180}
                    max={180}
                    required
                    defaultValue={alamatKursus.lon}
                  />
                  <CFormInput
                    classnama="mb-3"
                    type="number"
                    step="any"
                    id="floatingnama"
                    floatingLabel="lat"
                    placeholder="lat"
                    onChange={(e) => {
                      setInput({
                        ...input,
                        lat: parseFloat(e.target.value),
                      })
                    }}
                    required
                    min={-90}
                    max={90}
                    defaultValue={alamatKursus.lat}
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
                          [alamatKursus.id_alamat_kursus]: false,
                        },
                      }))
                    }}
                  >
                    Tutup
                  </CButton>
                  <CButton color="primary" type="submit">
                    Edit Alamat Kursus
                  </CButton>
                </CModalFooter>
              </CForm>
            </CModal>

            <CModal
              visible={visible.delete[alamatKursus.id_alamat_kursus]}
              onClose={() => {
                setVisible((prevVisible) => ({
                  ...prevVisible,
                  delete: {
                    ...prevVisible.delete,
                    [alamatKursus.id_alamat_kursus]: false,
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
                      [alamatKursus.id_alamat_kursus]: false,
                    },
                  }))
                }}
              >
                <CModalTitle>Delete Subkriteria</CModalTitle>
              </CModalHeader>
              <CModalBody>Apakah kamu yakin ingin menghapus {alamatKursus.nama}?</CModalBody>
              <CModalFooter>
                <CButton
                  color="secondary"
                  onClick={() => {
                    setVisible((prevVisible) => ({
                      ...prevVisible,
                      delete: {
                        ...prevVisible.delete,
                        [alamatKursus.id_alamat_kursus]: false,
                      },
                    }))
                  }}
                >
                  Tutup
                </CButton>
                <CButton
                  color="primary"
                  onClick={() => hapusAlamatKursus(alamatKursus.id_alamat_kursus)}
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
