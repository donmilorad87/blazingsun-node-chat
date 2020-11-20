const generateLocationImage = (cords,username) => {
    return {
        img: `<img src="https://static-maps.yandex.ru/1.x/?lang=sr-RS&ll=${cords.longitude},${cords.latitude}&z=14&size=600,300&pt=${cords.longitude},${cords.latitude},vkgrm&l=sat,trf,skl" />`,
        username,
        createdAt: transformTime()
    }
}

const transformTime = () => {

    timestamp = new Date()

    datevalues = {
        date: `${timestamp.toString()}`
    }

    return datevalues
}

module.exports = {
    generateLocationImage
}