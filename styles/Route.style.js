import { StyleSheet } from "react-native"

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    picker: {
        backgroundColor: '#fff',
        color: '#000', 
        alignSelf: 'center',
        marginTop: 0, 
        width: '100%', 
        height:'20px',
    },
    flatListItem: {
        width: '100%',
        paddingLeft:5, 
        paddingTop:5,
        paddingRight: 10,
        paddingBottom:10,
        marginVertical: 0.02,
        borderRadius: 1,
        borderRadius: 0,
        borderTopWidth: 0.5,
        borderColor: '#ccc',
    },
});
