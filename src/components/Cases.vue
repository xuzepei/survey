<template>
    <div>
        <h1>{{ title }}</h1>
    </div>
</template>

<style>
div {
    text-align: left;
}

.title-div {
    margin-top: 20px;
    font-family: Arial, sans-serif;
    font-size: 20px;
    font-weight: bold;
    text-align: left;
    color: black;
}

/* ul {
    list-style-type: none;
    padding: 0px; 
} */

li {
    line-height: 2;
}

.green_class {
    color: green;
}

.v-for-row {
    display: flex;
    flex-direction: row;
}

.v-for-row-item {
    font-size: 32px;
    font-weight: bold;
    margin-right: 10px;
    background-color: pink;
}

.v-for-buttons button {
    margin-right: 10px;
    margin-top: 10px;
}

#container {
    color: red;
}

.beRed {
    color: red;
}
</style>

<script>

export default {
    mounted() {
        console.log('Cases has been mounted!');
    },
    created() { 
        console.log('Cases has been created!');
    },
    data() {
        return {
            title: "Cases",
        };
    },
};
</script>