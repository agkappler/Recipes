package com.recipes.services;

import javax.sql.DataSource;

import org.springframework.stereotype.Service;

import com.utils.Data;

@Service
public class BaseService {
	
	protected final DataSource dataSource;
	protected final Data data;

	public BaseService(DataSource dataSource, Data data) {
	    this.dataSource = dataSource;
	    this.data = data;
	  }
}
