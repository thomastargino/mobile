import React, { useState } from 'react';
import { View, Image, Text, Linking } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../../services/api';

import heartOutlineIcon from '../../assets/images/icons/heart-outline.png';
import unfavoriteIcon from '../../assets/images/icons/unfavorite.png';
import whatsappIcon from '../../assets/images/icons/whatsapp.png';

import styles from './styles';

export interface Teacher {
  id: number;
  avatar: string;
  bio: string;
  cost: number;
  name: string;
  subject: string;
  whatsapp: number;
}

interface TeacherItemProps {
  teacher: Teacher;
  favorited: boolean;
}

const TeacherItem: React.FC<TeacherItemProps> = ({ teacher, favorited }) => {
    const [isFavorited, setIsFavorited] = useState(favorited);

    function handleLinkToWhatsapp() {
      api.post('connections', {
        user_id: teacher.id,
      })

      Linking.openURL(`whatsapp://send?phone=${+5581998242870}`);
    }

    async function handleToggleFavorite() {
      const favorites = await AsyncStorage.getItem("favorites");

      let favoriteArray = [];

      if (favorites) {
        favoriteArray = JSON.parse(favorites);
      }

      if(isFavorited) {
        const favoriteIndex = favoriteArray.findIndex((teacherItem: Teacher) => {
          return teacherItem.id === teacher.id;
        });

        favoriteArray.splice(favoriteIndex, 1);

        setIsFavorited(false);
      }else {
        favoriteArray.push(teacher);

        setIsFavorited(true);
      }
      
      await AsyncStorage.setItem('favorites', JSON.stringify(favoriteArray));
    }

    return (
      <View style={styles.container}>
        <View style={styles.profile}>
          <Image
            style={styles.avatar}
            source={{
              uri: "https://avatars0.githubusercontent.com/u/6594484?s=460&v=4",
            }}
          />

          <View style={styles.profileInfo}>
            <Text style={styles.name}>Thomás Targino</Text>
            <Text style={styles.subject}>Química</Text>
          </View>
        </View>

        <Text style={styles.bio}>
          Entusiasta das melhores tecnologias de química avançada.
          {"\n"}{"\n"}
          Apaixonado por explodir coisas em laboratório e por mudar a vida das pessoas.
        </Text>

        <View style={styles.footer}>
          <Text style={styles.price}>
            Preço/hora {"   "}
            <Text style={styles.priceValue}>R$ 20,00</Text>
          </Text>

          <View style={styles.buttonsContainer}>
            <RectButton 
              onPress={handleToggleFavorite}
              style={[
                styles.favoriteButton, 
                isFavorited ?  styles.favorited : {},
              ]}
            >
              { isFavorited
                ? <Image source={unfavoriteIcon} />
                : <Image source={heartOutlineIcon} />
              }
            </RectButton>

            <RectButton
              onPress={handleLinkToWhatsapp}
              style={styles.contactButton}
            >
              <Image source={whatsappIcon} />
              <Text style={styles.contactButtonText}>Entrar em contato</Text>
            </RectButton>
          </View>
        </View>
      </View>
    );
}

export default TeacherItem;