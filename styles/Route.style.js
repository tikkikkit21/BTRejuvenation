import { StyleSheet } from "react-native"

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'left',
        justifyContent: 'flex-start', 
        paddingTop: 0, 
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
        paddingLeft:10,
        paddingRight: '32%', 
        paddingTop: 5, 
        paddingBottom: 5, 
        marginVertical: 0.02,
        borderRadius: 1,
        borderRadius: 0,
        borderWidth: 0.5,
        borderColor: '#ccc',
    },
});
