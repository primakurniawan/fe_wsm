import React, { useRef, useEffect, useState, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import './RuteTerpendek.css'
import axios from 'axios'
import { CCol, CContainer, CFormSelect, CListGroup, CListGroupItem, CRow } from '@coreui/react'

mapboxgl.accessToken =
  'pk.eyJ1IjoicHJpbWFrdXJuaWF3YW4iLCJhIjoiY2wzamVrOHhvMDZyMzNqbzQ1cmt4anJ0ZCJ9.plWxz32egjvGNLpCZL9uVg'

const RuteTerpendek = () => {
  const [kursus, setKursus] = useState([])
  const [idKursus, setIdKursus] = useState(null)
  const [alamatKursus, setAlamatKursus] = useState([])
  const [route, setRoute] = useState({})
  const map = useRef(null)
  const mapContainer = useRef(null)
  const point = useRef(null)
  const popUp = useRef(null)
  const markers = useRef([])

  const [currentCoordinates, setCurrentCoordinates] = useState([0, 0])

  const [activeIdAlamatKursus, setActiveIdAlamatKursus] = useState(null)

  const getKursus = async () => {
    const response = await axios.get(`http://localhost:3000/kursus`)

    setKursus((prevState) => response.data.data)
    setIdKursus(response.data.data[0].id)
  }

  const getAlamatKursus = async (id_kursus) => {
    const response = await axios.get(`http://localhost:3000/alamat?id_kursus=${id_kursus}`)
    setAlamatKursus((prevState) => response.data.data)
  }

  const getRoutes = useCallback(
    async (idAlamatKursusTujuan) => {
      const response = await axios.get(
        `http://localhost:3000/alamat/ruteTerpendek?id_kursus=${idKursus}&current_location=[${currentCoordinates}]&id_alamat_kursus=${idAlamatKursusTujuan}`,
      )
      setRoute((prevState) => response.data.data.routes[0])

      if (map.current.getLayer('route')) map.current.removeLayer('route')
      if (map.current.getSource('route')) map.current.removeSource('route')

      map.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: response.data.data.routes[0].geometry.coordinates,
          },
        },
      })

      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#888',
          'line-width': 8,
        },
      })
    },
    [currentCoordinates, idKursus],
  )

  // Initialize map when component mounts
  useEffect(() => {
    getKursus()
    if (idKursus) getAlamatKursus(idKursus)
    navigator.geolocation.getCurrentPosition(function (position) {
      setCurrentCoordinates((prevState) => [position.coords.longitude, position.coords.latitude])
    })
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/navigation-night-v1',
      center: currentCoordinates,
      zoom: 13,
    })

    // Clean up on unmount
    return () => map.current.remove()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (idKursus) getAlamatKursus(idKursus)
    if (map.current.getLayer('route')) map.current.removeLayer('route')
    if (map.current.getSource('route')) map.current.removeSource('route')
    if (popUp.current) popUp.current.remove()
    map.current.flyTo({ center: currentCoordinates })
    setActiveIdAlamatKursus(null)
  }, [currentCoordinates, idKursus])

  useEffect(() => {
    if (point.current) {
      point.current.remove()
      if (map.current.getLayer('point')) map.current.removeLayer('point')
      if (map.current.getSource('point')) map.current.removeSource('point')
    }

    // Create a new marker.
    point.current = new mapboxgl.Marker().setLngLat(currentCoordinates).addTo(map.current)

    map.current.on('load', () => {
      map.current.addSource('point', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: currentCoordinates,
          },
        },
      })

      map.current.addLayer({
        id: 'point',
        type: 'symbol',
        source: 'point',
      })
    })

    map.current.flyTo({ center: currentCoordinates })
  }, [currentCoordinates])

  const addMarkers = useCallback(
    (alamatKursus) => {
      if (markers.current) {
        markers.current.forEach((e, i) => {
          markers.current[i].remove()
        })
      }
      /* For each feature in the GeoJSON object above: */
      alamatKursus.forEach((eAlamatKursus, index) => {
        /* Create a div element for the marker. */
        const el = document.createElement('div')
        /* Assign a unique `id` to the marker. */
        el.id = `marker-${eAlamatKursus.id_alamat_kursus}`
        /* Assign the `marker` class to each marker for styling. */
        el.className = 'marker'

        /**
         * Create a marker using the div element
         * defined above and add it to the map.
         **/
        markers.current[index] = new mapboxgl.Marker(el, { offset: [0, -23] })
          .setLngLat([eAlamatKursus.lon, eAlamatKursus.lat])
          .addTo(map.current)
        el.addEventListener('click', (e) => {
          if (eAlamatKursus.id_alamat_kursus !== activeIdAlamatKursus) {
            setActiveIdAlamatKursus(eAlamatKursus.id_alamat_kursus)
            flyToStore(eAlamatKursus)
            createPopUp(eAlamatKursus)
            getRoutes(eAlamatKursus.id_alamat_kursus)
          } else {
            setActiveIdAlamatKursus(null)
            flyToPoint(currentCoordinates)
            popUp.current.remove()
            if (map.current.getLayer('route')) map.current.removeLayer('route')
            if (map.current.getSource('route')) map.current.removeSource('route')
          }

          e.stopPropagation()
        })
      })
    },
    [activeIdAlamatKursus, currentCoordinates, getRoutes],
  )

  useEffect(() => {
    addMarkers(alamatKursus)
  }, [addMarkers, alamatKursus])

  function flyToStore(currentFeature) {
    map.current.flyTo({
      center: [currentFeature.lon, currentFeature.lat],
      zoom: 13,
    })
  }

  function flyToPoint(currentPosition) {
    map.current.flyTo({
      center: currentPosition,
      zoom: 13,
    })
  }

  function createPopUp(currentFeature) {
    if (popUp.current) popUp.current.remove()

    popUp.current = new mapboxgl.Popup({ closeOnClick: false })
      .setLngLat([currentFeature.lon, currentFeature.lat])
      .setHTML(`<h3>${currentFeature.nama_alamat_kursus}</h3><h4>${currentFeature.alamat}</h4>`)
      .addTo(map.current)
  }

  return (
    <CContainer fluid className="bg-oxford-blue">
      <CRow fluid>
        <CCol
          xs="3"
          style={{
            height: '100vh',
            overflow: 'scroll',
          }}
        >
          <CFormSelect
            className="mb-3"
            size="sm"
            label="Kursus"
            options={kursus.map((kursus) => ({
              value: kursus.id,
              label: kursus.nama,
            }))}
            onChange={(e) => setIdKursus(parseInt(e.target.value))}
          />
          <CListGroup flush className="bg-oxford-blue">
            {alamatKursus.length > 0 &&
              alamatKursus.map((eAlamatKursus) => {
                return (
                  <CListGroupItem
                    className="bg-oxford-blue-2 cl-white"
                    key={eAlamatKursus.id_alamat_kursus}
                    id={`listing-${eAlamatKursus.id_alamat_kursus}`}
                    active={eAlamatKursus.id_alamat_kursus === activeIdAlamatKursus}
                    onClick={function () {
                      for (const e of alamatKursus) {
                        if (eAlamatKursus.id_alamat_kursus === e.id_alamat_kursus) {
                          if (e.id_alamat_kursus !== activeIdAlamatKursus) {
                            setActiveIdAlamatKursus(eAlamatKursus.id_alamat_kursus)
                            flyToStore(e)
                            createPopUp(e)
                            getRoutes(e.id_alamat_kursus)
                          } else {
                            setActiveIdAlamatKursus(null)
                            flyToPoint(currentCoordinates)
                            popUp.current.remove()
                            if (map.current.getLayer('route')) map.current.removeLayer('route')
                            if (map.current.getSource('route')) map.current.removeSource('route')
                          }
                        }
                      }
                    }}
                  >
                    <h4>{eAlamatKursus.nama_alamat_kursus}</h4>
                    {/* </span>
                          <div> */}
                    <h6>{eAlamatKursus.alamat}</h6>
                    {/* <br /> */}
                    {/* </div> */}
                  </CListGroupItem>
                )
              })}
          </CListGroup>
        </CCol>
        <CCol xs="6">
          <div id="map" className="map" ref={mapContainer}></div>
        </CCol>
        <CCol xs="3" className="cl-white">
          {route?.legs?.length > 0 && activeIdAlamatKursus && (
            <>
              <p>
                <strong>Trip duration: {Math.floor(route.duration / 60)} min 🕰️ </strong>
                <br />
                <strong>Trip distance: {Math.floor(route.distance / 1000)} km 🚗 </strong>
              </p>
              <ol>
                {route.legs.map((leg, i) =>
                  leg.steps.map((step, j) => <li key={`${i}${j}`}>{step.maneuver.instruction}</li>),
                )}
              </ol>
            </>
          )}
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default RuteTerpendek
