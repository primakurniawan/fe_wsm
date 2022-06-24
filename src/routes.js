import React from 'react'

const Jurusan = React.lazy(() => import('./views/Jurusan'))
const Fakultas = React.lazy(() => import('./views/Fakultas.js'))
const Subkriteria = React.lazy(() => import('./views/Subkriteria'))
const Kriteria = React.lazy(() => import('./views/Kriteria'))
const Parameter = React.lazy(() => import('./views/Parameter'))
const Rekomendasi = React.lazy(() => import('./views/Rekomendasi'))
const Kursus = React.lazy(() => import('./views/Kursus'))
const AlamatKursus = React.lazy(() => import('./views/AlamatKursus'))
const RuteTerpendek = React.lazy(() => import('./views/RuteTerpendek'))
const Aspects = React.lazy(() => import('./views/Aspects'))
const Criteria = React.lazy(() => import('./views/Criteria'))
const Parameters = React.lazy(() => import('./views/Parameters'))
const Ranking = React.lazy(() => import('./views/Ranking'))
const Stores = React.lazy(() => import('./views/Stores'))
const Shortest = React.lazy(() => import('./views/Shortest'))

const routes = [
  { path: '/alternatives', name: 'Alternatives', element: Jurusan },
  { path: '/jurusan', name: 'Jurusan', element: Jurusan },
  { path: '/fakultas', name: 'Fakultas', element: Fakultas },
  { path: '/kriteria', name: 'Kriteria', element: Kriteria },
  { path: '/subkriteria', name: 'Subkriteria', element: Subkriteria },
  { path: '/parameter', name: 'Parameter', element: Parameter },
  { path: '/rekomendasi', name: 'Rekomendasi', element: Rekomendasi },
  { path: '/kursus', name: 'Kursus', element: Kursus },
  { path: '/alamatKursus', name: 'AlamatKursus', element: AlamatKursus },
  { path: '/ruteTerpendek', name: 'RuteTerpendek', element: RuteTerpendek },
  { path: '/aspects', name: 'Aspects', element: Aspects },
  { path: '/criteria', name: 'Criteria', element: Criteria },
  { path: '/parameters', name: 'Parameters', element: Parameters },
  { path: '/ranking', name: 'Ranking', element: Ranking },
  { path: '/stores', name: 'Stores', element: Stores },
  { path: '/shortest', name: 'Shortest', element: Shortest },
  { path: '/', exact: true, name: 'Home' },
]

export default routes
