import { Controller, Get, Post, Put, Delete, Body, Param, Query, UsePipes, ValidationPipe, Logger, HttpCode, HttpStatus } from '@nestjs/common';
import { AdsService } from './ads.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { KAFKA_TOPICS } from '../common/constants/kafka-topics';
import { KafkaService } from '../kafka/kafka.service';
import { v4 as uuidv4 } from 'uuid';

@Controller('ads')
export class AdsController {
  private readonly logger = new Logger(AdsController.name);

  constructor(
    private readonly adsService: AdsService,
    private readonly kafkaService: KafkaService
  ) {}

  /**
   * Create a new ad via HTTP (REST API)
   * This is useful for direct API calls, but in microservices architecture,
   * you might want to use Kafka for all operations
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  async createAd(@Body() createAdDto: CreateAdDto) {
    this.logger.log(`REST: Creating new ad for user: ${createAdDto.userId}`);
    
    try {
      const ad = await this.adsService.createAd(createAdDto);
      
      // Emit event to Kafka
      await this.adsService.emitAdCreated(ad, uuidv4());
      
      return {
        success: true,
        message: 'Ad created successfully',
        data: ad,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error(`REST: Error creating ad: ${error.message}`);
      
      return {
        success: false,
        message: 'Failed to create ad',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Create ad via Kafka - This endpoint sends a Kafka message instead of direct creation
   * Useful for async operations
   */
  @Post('async')
  @HttpCode(HttpStatus.ACCEPTED)
  async createAdAsync(@Body() createAdDto: CreateAdDto) {
    this.logger.log(`REST: Sending async ad creation request for user: ${createAdDto.userId}`);
    
    const correlationId = uuidv4();
    
    try {
      // Send to Kafka instead of direct creation
      await this.kafkaService.send(KAFKA_TOPICS.AD_CREATE, createAdDto, correlationId);
      
      return {
        success: true,
        message: 'Ad creation request submitted successfully',
        correlationId,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error(`REST: Error sending async ad creation: ${error.message}`);
      
      return {
        success: false,
        message: 'Failed to submit ad creation request',
        error: error.message,
        correlationId,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get all ads with pagination
   */
  @Get()
  async getAllAds(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('category') category?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string
  ) {
    this.logger.log(`REST: Getting all ads - Page: ${page}, Limit: ${limit}`);
    
    try {
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      
      let result;
      if (category) {
        result = await this.adsService.getAdsByCategory(
          category, 
          pageNum, 
          limitNum, 
          sortBy || 'createdAt', 
          sortOrder || 'desc'
        );
      } else {
        // You might want to add a getAllAds method to service
        result = await this.adsService.searchAds('', {}, pageNum, limitNum);
      }
      
      return {
        success: true,
        data: result.ads,
        pagination: {
          total: result.total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(result.total / limitNum)
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error(`REST: Error getting ads: ${error.message}`);
      
      return {
        success: false,
        message: 'Failed to get ads',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Search ads with filters
   */
  @Get('search')
  async searchAds(
    @Query('q') query: string = '',
    @Query('category') category?: string,
    @Query('location') location?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ) {
    this.logger.log(`REST: Searching ads with query: ${query}`);
    
    try {
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      
      const filters = {
        category,
        location,
        minPrice: minPrice ? parseInt(minPrice, 10) : undefined,
        maxPrice: maxPrice ? parseInt(maxPrice, 10) : undefined
      };
      
      const result = await this.adsService.searchAds(query, filters, pageNum, limitNum);
      
      return {
        success: true,
        data: result.ads,
        pagination: {
          total: result.total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(result.total / limitNum)
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error(`REST: Error searching ads: ${error.message}`);
      
      return {
        success: false,
        message: 'Failed to search ads',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get nearby ads by location
   */
  @Get('nearby')
  async getNearbyAds(
    @Query('lat') latitude: string,
    @Query('lng') longitude: string,
    @Query('distance') distance: string = '10000',
    @Query('category') category?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ) {
    this.logger.log(`REST: Getting nearby ads at (${latitude}, ${longitude})`);
    
    try {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      const maxDistance = parseInt(distance, 10);
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      
      const result = await this.adsService.getNearbyAds(
        lat, 
        lng, 
        maxDistance, 
        category, 
        pageNum, 
        limitNum
      );
      
      return {
        success: true,
        data: result.ads,
        pagination: {
          total: result.total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(result.total / limitNum)
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error(`REST: Error getting nearby ads: ${error.message}`);
      
      return {
        success: false,
        message: 'Failed to get nearby ads',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get ads by category
   */
  @Get('category/:category')
  async getAdsByCategory(
    @Param('category') category: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string
  ) {
    this.logger.log(`REST: Getting ads by category: ${category}`);
    
    try {
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      
      const result = await this.adsService.getAdsByCategory(
        category, 
        pageNum, 
        limitNum,
        sortBy || 'createdAt',
        sortOrder || 'desc'
      );
      
      return {
        success: true,
        data: result.ads,
        pagination: {
          total: result.total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(result.total / limitNum)
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error(`REST: Error getting ads by category: ${error.message}`);
      
      return {
        success: false,
        message: 'Failed to get ads by category',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get ads by user
   */
  @Get('user/:userId')
  async getAdsByUser(
    @Param('userId') userId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ) {
    this.logger.log(`REST: Getting ads by user: ${userId}`);
    
    try {
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      
      const result = await this.adsService.getAdsByUser(userId, pageNum, limitNum);
      
      return {
        success: true,
        data: result.ads,
        pagination: {
          total: result.total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(result.total / limitNum)
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error(`REST: Error getting ads by user: ${error.message}`);
      
      return {
        success: false,
        message: 'Failed to get ads by user',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get single ad by ID
   */
  @Get(':adId')
  async getAdById(@Param('adId') adId: string) {
    this.logger.log(`REST: Getting ad by ID: ${adId}`);
    
    try {
      const ad = await this.adsService.getAdById(adId);
      
      // Increment view count asynchronously
      this.adsService.incrementViewCount(adId).catch(error => {
        this.logger.error(`Error incrementing view count: ${error.message}`);
      });
      
      return {
        success: true,
        data: ad,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error(`REST: Error getting ad: ${error.message}`);
      
      return {
        success: false,
        message: 'Failed to get ad',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Update ad
   */
  @Put(':adId')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateAd(
    @Param('adId') adId: string,
    @Body('userId') userId: string,
    @Body() updateData: UpdateAdDto
  ) {
    this.logger.log(`REST: Updating ad: ${adId} by user: ${userId}`);
    
    if (!userId) {
      return {
        success: false,
        message: 'userId is required',
        timestamp: new Date().toISOString()
      };
    }
    
    try {
      const updatedAd = await this.adsService.updateAd(adId, userId, updateData);
      
      // Emit update event
      await this.adsService.emitAdUpdated(updatedAd, uuidv4());
      
      return {
        success: true,
        message: 'Ad updated successfully',
        data: updatedAd,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error(`REST: Error updating ad: ${error.message}`);
      
      return {
        success: false,
        message: 'Failed to update ad',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Update ad via Kafka (async)
   */
  @Put(':adId/async')
  @HttpCode(HttpStatus.ACCEPTED)
  async updateAdAsync(
    @Param('adId') adId: string,
    @Body('userId') userId: string,
    @Body() updateData: UpdateAdDto
  ) {
    this.logger.log(`REST: Sending async update request for ad: ${adId}`);
    
    if (!userId) {
      return {
        success: false,
        message: 'userId is required',
        timestamp: new Date().toISOString()
      };
    }
    
    const correlationId = uuidv4();
    
    try {
      await this.kafkaService.send(KAFKA_TOPICS.AD_UPDATE, {
        adId,
        userId,
        updateData
      }, correlationId);
      
      return {
        success: true,
        message: 'Ad update request submitted successfully',
        correlationId,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error(`REST: Error sending async update: ${error.message}`);
      
      return {
        success: false,
        message: 'Failed to submit ad update request',
        error: error.message,
        correlationId,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Delete ad (soft delete)
   */
  @Delete(':adId')
  async deleteAd(
    @Param('adId') adId: string,
    @Query('userId') userId: string
  ) {
    this.logger.log(`REST: Deleting ad: ${adId} by user: ${userId}`);
    
    if (!userId) {
      return {
        success: false,
        message: 'userId is required',
        timestamp: new Date().toISOString()
      };
    }
    
    try {
      await this.adsService.deleteAd(adId, userId);
      
      // Emit delete event
      await this.adsService.emitAdDeleted(adId, userId, uuidv4());
      
      return {
        success: true,
        message: 'Ad deleted successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error(`REST: Error deleting ad: ${error.message}`);
      
      return {
        success: false,
        message: 'Failed to delete ad',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Delete ad via Kafka (async)
   */
  @Delete(':adId/async')
  @HttpCode(HttpStatus.ACCEPTED)
  async deleteAdAsync(
    @Param('adId') adId: string,
    @Query('userId') userId: string
  ) {
    this.logger.log(`REST: Sending async delete request for ad: ${adId}`);
    
    if (!userId) {
      return {
        success: false,
        message: 'userId is required',
        timestamp: new Date().toISOString()
      };
    }
    
    const correlationId = uuidv4();
    
    try {
      await this.kafkaService.send(KAFKA_TOPICS.AD_DELETE, {
        adId,
        userId
      }, correlationId);
      
      return {
        success: true,
        message: 'Ad delete request submitted successfully',
        correlationId,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error(`REST: Error sending async delete: ${error.message}`);
      
      return {
        success: false,
        message: 'Failed to submit ad delete request',
        error: error.message,
        correlationId,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Promote an ad
   */
  @Post(':adId/promote')
  async promoteAd(
    @Param('adId') adId: string,
    @Body('userId') userId: string,
    @Body('package') promotionPackage: string,
    @Body('duration') duration: number // in days
  ) {
    this.logger.log(`REST: Promoting ad: ${adId} with package: ${promotionPackage}`);
    
    if (!userId) {
      return {
        success: false,
        message: 'userId is required',
        timestamp: new Date().toISOString()
      };
    }
    
    try {
      const promotedUntil = new Date();
      promotedUntil.setDate(promotedUntil.getDate() + duration);
      
      const updateData: UpdateAdDto = {
        isPromoted: true,
        promotedUntil,
        promotionPackage
      };
      
      const updatedAd = await this.adsService.updateAd(adId, userId, updateData);
      
      // Emit promotion event
      await this.kafkaService.emit(KAFKA_TOPICS.AD_PROMOTED, {
        adId,
        userId,
        promotionPackage,
        promotedUntil,
        timestamp: new Date().toISOString()
      }, uuidv4());
      
      return {
        success: true,
        message: 'Ad promoted successfully',
        data: updatedAd,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error(`REST: Error promoting ad: ${error.message}`);
      
      return {
        success: false,
        message: 'Failed to promote ad',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get promoted ads
   */
  @Get('promoted/all')
  async getPromotedAds(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ) {
    this.logger.log('REST: Getting promoted ads');
    
    try {
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      
      // You might want to add a specific method in service for promoted ads
      const result = await this.adsService.searchAds(
        '', 
        {}, 
        pageNum, 
        limitNum
      );
      
      // Filter promoted ads (you can optimize this with a database query)
      const promotedAds = result.ads.filter(ad => ad.isPromoted && ad.promotedUntil > new Date());
      
      return {
        success: true,
        data: promotedAds,
        pagination: {
          total: promotedAds.length,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(promotedAds.length / limitNum)
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error(`REST: Error getting promoted ads: ${error.message}`);
      
      return {
        success: false,
        message: 'Failed to get promoted ads',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get ads statistics
   */
  @Get('stats/overview')
  async getAdsStatistics() {
    this.logger.log('REST: Getting ads statistics');
    
    try {
      // You might want to add aggregation methods in service
      const totalAds = await this.adsService.searchAds('', {}, 1, 1);
      
      // Get category distribution (you should add a method in service for this)
      const categories = [
        'Education', 'Matrimonial', 'Vehicle', 'Business', 'Travel',
        'Astrology', 'Property', 'Public Notice', 'Lost & Found',
        'Service', 'Personal', 'Employment', 'Pets', 'Mobiles',
        'Electronics & Home appliances', 'Furniture', 'Other'
      ];
      
      const categoryStats = await Promise.all(
        categories.map(async (category) => {
          const result = await this.adsService.getAdsByCategory(category, 1, 1);
          return {
            category,
            count: result.total
          };
        })
      );
      
      return {
        success: true,
        data: {
          totalAds: totalAds.total,
          activeAds: totalAds.total, // You should add proper filtering
          promotedAds: 0, // You should add proper counting
          categoryDistribution: categoryStats
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error(`REST: Error getting statistics: ${error.message}`);
      
      return {
        success: false,
        message: 'Failed to get statistics',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Health check endpoint
   */
  @Get('health/status')
  healthCheck() {
    return {
      status: 'healthy',
      service: 'ads-microservice',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    };
  }
}