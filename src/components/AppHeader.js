import React, { useCallback, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderNav,
  CNavLink,
  CNavItem,
  CFormSelect,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { logo } from 'src/assets/brand/logo'
import { change, get } from 'src/categoriesSlice'
import axios from 'axios'

const AppHeader = () => {
  const dispatch = useDispatch()
  const categories = useSelector((state) => state.categories)
  const getCategories = useCallback(async () => {
    const response = await axios.get(`http://localhost:3000/categories`)
    dispatch(get(response.data.data))
    dispatch(change(response.data.data[0].id))
  }, [dispatch])
  useEffect(() => {
    getCategories()
  }, [getCategories])

  return (
    <CHeader position="sticky" className="mb-4 bg-dark">
      <CContainer className="">
        <CHeaderNav className="d-none d-md-flex me-auto">
          <CNavItem>
            <CDropdown >
              <CDropdownToggle size="sm" color="light">
                Jurusan & Fakultas
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>
                  {' '}
                  <CNavLink to="/jurusan" component={NavLink}>
                    Daftar Jurusan
                  </CNavLink>
                </CDropdownItem>
                <CDropdownItem>
                  {' '}
                  <CNavLink to="/fakultas" component={NavLink}>
                    Daftar Fakultas
                  </CNavLink>
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          </CNavItem>
          <CNavItem>
            <CDropdown>
              <CDropdownToggle size="sm" color="light">
                Konfigurasi
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>
                  {' '}
                  <CNavLink to="/kriteria" component={NavLink}>
                    Kriteria
                  </CNavLink>
                </CDropdownItem>
                <CDropdownItem>
                  {' '}
                  <CNavLink to="/subkriteria" component={NavLink}>
                    Subkriteria
                  </CNavLink>
                </CDropdownItem>
                <CDropdownItem>
                  {' '}
                  <CNavLink to="/parameter" component={NavLink}>
                    Parameter
                  </CNavLink>
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          </CNavItem>
          <CNavItem>
            <CDropdown>
              <CDropdownToggle size="sm" color="light">
                Tempat Kursus
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>
                  {' '}
                  <CNavLink to="/kursus" component={NavLink}>
                    Daftar Kursus
                  </CNavLink>
                </CDropdownItem>
                <CDropdownItem>
                  {' '}
                  <CNavLink to="/alamatKursus" component={NavLink}>
                    Alamat Kursus
                  </CNavLink>
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          </CNavItem>

          <CNavItem>
            <CNavLink to="/rekomendasi" component={NavLink} className="text-light">
              Rekomendasi
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink to="/ruteTerpendek" component={NavLink} className="text-light">
              Rute Terpendek
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
        <h3 className='text-light'>Calon anak USU</h3>
             <img src="https://pbs.twimg.com/profile_images/460654503633502208/bYjwyzPh.jpeg" height={48} alt="Logo" />
    
      </CContainer>
    </CHeader>
  )
}

export default AppHeader