import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    Image,
    TouchableOpacity,
    Dimensions,
} from 'react-native';

import ImageFoodDog from 'assets/images/imageReview.svg';
import { FlatList } from 'react-native';
import CommentItem from '../components/CommentItem';


const screenWidth = Dimensions.get('window').width;
const col=screenWidth/12


const reviews = [
    {
        id: '1',
        name: 'Sam',
        date: '24/10/2024',
        rating: 5.0,
        comment:
            'We have been using these for months now, every day one treat before bed. They are very high quality, easy to use as a bedtime treat, they have great health benefits for dogs with upset tummies, in a convenient way to serve to the dogs.',
    },
    {
        id: '2',
        name: 'Gadget lady',
        date: '20/10/2024',
        rating: 4.0,
        comment:
            "I was leery to purchase this food since being an older single woman and it's not cheap. But after several months I was glad I started my fur baby on it, her white coat turned soft and her skin became more soft, not as dry.",
    },
    {
        id: '3',
        name: 'Tebay',
        date: '19/10/2024',
        rating: 4.5,
        comment:
            'I love this product because it makes feeding my pup super easy. He loves the taste.',
    },
];

const ScreenReviews: React.FC = () => {
    return (

        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                
                <TouchableOpacity style={styles.back}>
                    <Image
                        source={require('../../../../../assets/icons/back.png')}
                        style={{ width: 24, height: 24 }}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Reviews</Text>
                <View/>
            </View>

            {/**todo: sau này thêm ảnh thật */}
            <Image 
            source={require('../../../../../assets/images/dog.png')}
            resizeMode='contain'
             style={styles.fooddog} />
            {/**todo: sau này thêm chức năng nhắn */}
            <View style={styles.writeReviewContainer}>
                {/**todo: thêm ảnh thật của sản phẩm */}
                <Image
                    source={require('../../../../../assets/icons/girl.png')}
                    style={styles.avatar}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Write your reviews..."
                    placeholderTextColor="#aaa"
                />
            </View>
            {/**todo: sau nay them data that */}
            <FlatList
                data={reviews}
                keyExtractor={item => item.id}
                renderItem={({ item }) =>
                (
                    <CommentItem 
                    comment={item.comment}
                    date={item.date}
                    name={item.name}
                    id={item.id}
                    rating={item.rating}
                    userAvatar='https://i.pravatar.cc/150?img=3'
                    onOptionsPress={(id) => console.log(`Options for review ${id}`)}
                    />
                )
                }
            />
        </View>
    );
};



export default ScreenReviews;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 24,
        paddingTop: 40,
    },
    header: {
        marginBottom: 16,
        justifyContent:'space-between',
        flexDirection:'row',
        alignItems: 'center',
    },
    back: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 4,
    },

    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    fooddog: {
        width: '100%',
        height: 300,
        boxShadow: '0 5px 20px rgba(12, 12, 12, 0.1)',
        borderRadius: 20,
        marginBottom: 18,
    },
    writeReviewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f1f1',
        borderRadius: 20,
        padding: 10,
        marginBottom: 16,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: '#000',
    },
    reviewList: {
        flex: 1,
    },
    reviewCard: {
        backgroundColor: '#fafafa',
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    reviewAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    reviewerName: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    reviewDate: {
        fontSize: 12,
        color: '#888',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    ratingText: {
        marginLeft: 4,
        fontWeight: 'bold',
        color: '#333',
    },
    reviewText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
});
