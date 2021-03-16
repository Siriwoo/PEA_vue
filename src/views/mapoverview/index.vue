<template>
  <div class="app-container">
    <div class="google-map" :id="mapName"></div>
  </div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination


export default {
  name: 'google-map',
  props: ['name'],
  data() {
    return {
      mapName: this.name + "-map",
      markerCoordinates: [{
        latitude: 14.979947,
        longitude: 102.084380
      }, {
        latitude: 14.874167,
        longitude: 103.001453
      }, {
        latitude: 14.933437,
        longitude: 103.706154
      }, {
        latitude: 16.086083,
        longitude: 101.893030
      }],
      map: null,
      bounds: null,
      markers: []
    }
  },
  created() {
  },
  mounted() {
    this.bounds = new google.maps.LatLngBounds();
    const element = document.getElementById(this.mapName)
    const mapCentre = this.markerCoordinates[0]
    const options = {
      center: new google.maps.LatLng(mapCentre.latitude, mapCentre.longitude),
      gestureHandling: "greedy"
    }
    this.map = new google.maps.Map(element, options);
    this.markerCoordinates.forEach((coord) => {
          const position = new google.maps.LatLng(coord.latitude, coord.longitude);
          const marker = new google.maps.Marker({
            position,
            map: this.map
          });
        this.markers.push(marker)
          this.map.fitBounds(this.bounds.extend(position))
     });
    }
  ,
  methods: {

  }
}
</script>
<style  scoped>
  .google-map {
    width: 800px;
    height: 600px;
    margin: 0 auto;
    background: gray;
    }
</style>
