import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { colors } from '../../../shared/theme/colors';
import { SPACING } from '../../../shared/theme/layout';
import { Fonts } from '../../../shared/theme/fonts';
import { BlogRespondDto } from 'src/presentation/dto/res/blog-respond.dto';
import { RouteProp, useRoute } from '@react-navigation/native';
import { MainStackParamList } from 'src/presentation/navigation/main-navigation/types';
import { useMainNavigation } from 'shared/hooks/navigation-hooks/useMainNavigationHooks';
import Icon from 'react-native-vector-icons/MaterialIcons';

const NewsScreen: React.FC = () => {
  const route = useRoute<RouteProp<MainStackParamList, 'NewsScreen'>>();
  const navigation = useMainNavigation();
  const blog = route?.params?.blog;

  if (!blog) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Không tìm thấy bài viết</Text>
      </View>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSharePress = () => {
    // TODO: Implement share functionality
  };

  // HTML template với CSS styling
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0;
          padding: 20px;
          background-color: #f8f9fa;
          color: #333;
          line-height: 1.6;
        }
        .blog-container {
          max-width: 100%;
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .blog-title {
          font-size: 24px;
          font-weight: bold;
          color: #222B45;
          margin-bottom: 16px;
          line-height: 1.3;
        }
        .blog-meta {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e0e0e0;
        }
        .author {
          font-size: 14px;
          color: #666;
          margin-right: 16px;
        }
        .date {
          font-size: 14px;
          color: #999;
        }
        .blog-content {
          font-size: 16px;
          line-height: 1.8;
          color: #333;
        }
        .blog-content p {
          margin-bottom: 16px;
        }
        .blog-content h1, .blog-content h2, .blog-content h3 {
          color: #222B45;
          margin-top: 24px;
          margin-bottom: 16px;
        }
        .blog-content h1 { font-size: 20px; }
        .blog-content h2 { font-size: 18px; }
        .blog-content h3 { font-size: 16px; }
        .blog-content ul, .blog-content ol {
          margin-bottom: 16px;
          padding-left: 20px;
        }
        .blog-content li {
          margin-bottom: 8px;
        }
        .blog-content blockquote {
          border-left: 4px solid #FFAF42;
          padding-left: 16px;
          margin: 20px 0;
          font-style: italic;
          color: #666;
        }
        .blog-content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 16px 0;
        }
        .blog-content a {
          color: #FFAF42;
          text-decoration: none;
        }
        .blog-content a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="blog-container">
        <h1 class="blog-title">${blog.title}</h1>
        <div class="blog-meta">
          <span class="author">Tác giả: ${blog.author}</span>
          <span class="date">${formatDate(blog.createdAt)}</span>
        </div>
        <div class="blog-content">
          ${blog.content}
        </div>
      </div>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Icon name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bài viết</Text>
        <TouchableOpacity style={styles.shareButton} onPress={handleSharePress}>
          <Icon name="share" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* WebView Content */}
      <WebView
        source={{ html: htmlContent }}
        style={styles.webview}
        showsVerticalScrollIndicator={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.app.primary.main,
    paddingHorizontal: SPACING.M,
    paddingVertical: SPACING.S,
    height: 56,
    paddingTop: SPACING.M,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.roboto.bold,
    color: colors.white,
    fontWeight: 'bold',
  },
  shareButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webview: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.default,
  },
  errorText: {
    fontSize: 16,
    color: colors.text.secondary,
    fontFamily: Fonts.roboto.regular,
  },
});

export default NewsScreen;