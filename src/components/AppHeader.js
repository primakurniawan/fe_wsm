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
    <CHeader position="sticky" className="mb-4">
      <CContainer>
        <CHeaderBrand className="mx-auto d-md-none" to="/">
          <img src="src\assets\images\logo_usu.png" height={48} alt="Logo" />
        </CHeaderBrand>
        <CHeaderNav className="d-none d-md-flex me-auto">
          <CNavItem>
            <CDropdown>
              <CDropdownToggle size="sm" color="secondary">
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
              <CDropdownToggle size="sm" color="secondary">
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
              <CDropdownToggle size="sm" color="secondary">
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
            <CNavLink to="/rekomendasi" component={NavLink}>
              Rekomendasi
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink to="/ruteTerpendek" component={NavLink}>
              Rute Terpendek
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
