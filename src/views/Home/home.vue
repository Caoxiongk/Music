<template>
<div id="Home">
    <van-sticky>
        <top></top>
    </van-sticky>
    <center></center>
    <bottom></bottom>

</div>
</template>

<script lang="ts">
import {
    Component,
    Vue
} from 'vue-property-decorator';
import top from '../Home/top.vue';
import bottom from '../Home/bottom.vue';
import center from '../Home/conter.vue';
@Component({
    components: {
        top,
        bottom,
        center
    },
})
export default class Home extends Vue {}
</script>
