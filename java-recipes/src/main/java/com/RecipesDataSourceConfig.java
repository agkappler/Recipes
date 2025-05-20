package com;

import javax.sql.DataSource;

import org.json.JSONObject;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import com.utils.data.Data;
import com.utils.data.SecretManager;

@Configuration
public class RecipesDataSourceConfig {

	@Bean
	public DataSource dataSource() {
		final DriverManagerDataSource dataSource = new DriverManagerDataSource();
		
//		dataSource.setDriverClassName("org.sqlite.JDBC");
//		dataSource.setUrl("jdbc:sqlite:/Users/akappler/Documents/DevProjects/RecipesDB/recipes.db");
		
		String secret = SecretManager.getSecret();
		JSONObject secretObj = new JSONObject(secret);
		dataSource.setDriverClassName("org.postgresql.Driver");
		String url = "jdbc:postgresql://" + secretObj.getString("host") + "/" + secretObj.getString("dbname") + "?user=" + secretObj.getString("username") + "&password=" + secretObj.getString("password");
		dataSource.setUrl(url);
		
		return dataSource;
	}
	
	@Bean
	public Data data(DataSource dataSource) {
		return new Data(dataSource);
	}
}
