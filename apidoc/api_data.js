define({ api: [
  {
    "type": "post",
    "url": "/guilds",
    "title": "Create",
    "name": "Create",
    "group": "Guilds",
    "version": "0.1.0",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "field": "guilds",
            "optional": false,
            "description": "<p>A guild resource object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "guild.id",
            "optional": false,
            "description": "<p>Guild ID</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "guild.desc",
            "optional": false,
            "description": "<p>Short description</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "guild.link",
            "optional": false,
            "description": "<p>Link to the guild&#39;s page</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "guild.name",
            "optional": false,
            "description": "<p>Guild name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "guild.page",
            "optional": false,
            "description": "<p>Markdown to use for the guild&#39;s home page</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "guild.pic",
            "optional": false,
            "description": "<p>Link to the guild&#39;s index picture</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "field": "guild_id",
            "optional": false,
            "description": "<p>Guild ID</p>"
          }
        ]
      }
    },
    "filename": "api/v1/guilds/index.js"
  },
  {
    "type": "delete",
    "url": "/guilds/:guild_id",
    "title": "Delete",
    "name": "Delete",
    "group": "Guilds",
    "version": "0.1.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "field": "guild_id",
            "optional": false,
            "description": "<p>Guild ID</p>"
          }
        ]
      }
    },
    "filename": "api/v1/guilds/index.js"
  },
  {
    "type": "get",
    "url": "/guilds/:guild_id",
    "title": "Find",
    "name": "Find",
    "group": "Guilds",
    "version": "0.1.0",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "field": "guilds",
            "optional": false,
            "description": "<p>A guild resource object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "guild.id",
            "optional": false,
            "description": "<p>Guild ID</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "guild.desc",
            "optional": false,
            "description": "<p>Short description</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "guild.link",
            "optional": false,
            "description": "<p>Link to the guild&#39;s page</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "guild.name",
            "optional": false,
            "description": "<p>Guild name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "guild.page",
            "optional": false,
            "description": "<p>Markdown to use for the guild&#39;s home page</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "guild.pic",
            "optional": false,
            "description": "<p>Link to the guild&#39;s index picture</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "field": "guild_id",
            "optional": false,
            "description": "<p>Guild ID</p>"
          }
        ]
      }
    },
    "filename": "api/v1/guilds/index.js"
  },
  {
    "type": "get",
    "url": "/guilds",
    "title": "FindAll",
    "name": "FindAll",
    "group": "Guilds",
    "version": "0.1.0",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "field": "guilds",
            "optional": false,
            "description": "<p>List of guild resource objects</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "guild.id",
            "optional": false,
            "description": "<p>Guild ID</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "guild.desc",
            "optional": false,
            "description": "<p>Short description</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "guild.link",
            "optional": false,
            "description": "<p>Link to the guild&#39;s page</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "guild.name",
            "optional": false,
            "description": "<p>Guild name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "guild.page",
            "optional": false,
            "description": "<p>Markdown to use for the guild&#39;s home page</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "guild.pic",
            "optional": false,
            "description": "<p>Link to the guild&#39;s index picture</p>"
          }
        ]
      }
    },
    "filename": "api/v1/guilds/index.js"
  },
  {
    "type": "put",
    "url": "/guilds/:guild_id",
    "title": "Update",
    "name": "Update",
    "group": "Guilds",
    "version": "0.1.0",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "field": "guilds",
            "optional": false,
            "description": "<p>A guild resource object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "guild.id",
            "optional": false,
            "description": "<p>Guild ID</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "guild.desc",
            "optional": false,
            "description": "<p>Short description</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "guild.link",
            "optional": false,
            "description": "<p>Link to the guild&#39;s page</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "guild.name",
            "optional": false,
            "description": "<p>Guild name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "guild.page",
            "optional": false,
            "description": "<p>Markdown to use for the guild&#39;s home page</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "guild.pic",
            "optional": false,
            "description": "<p>Link to the guild&#39;s index picture</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "field": "guild_id",
            "optional": false,
            "description": "<p>Guild ID</p>"
          }
        ]
      }
    },
    "filename": "api/v1/guilds/index.js"
  },
  {
    "type": "post",
    "url": "/users",
    "title": "Create",
    "name": "Create",
    "version": "1.0.0",
    "group": "Users",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "_id",
            "optional": false,
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "username",
            "optional": false,
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "firstname",
            "optional": false,
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "lastname",
            "optional": false,
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "role",
            "optional": false,
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "avatarURL",
            "optional": false,
            "description": ""
          }
        ]
      }
    },
    "filename": "api/v1/users/index.js"
  },
  {
    "type": "delete",
    "url": "/users/:user_id",
    "title": "Delete",
    "name": "Delete",
    "version": "1.0.0",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectID",
            "field": "user_id",
            "optional": false,
            "description": "<p>User ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "_id",
            "optional": false,
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "username",
            "optional": false,
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "firstname",
            "optional": false,
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "lastname",
            "optional": false,
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "role",
            "optional": false,
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "avatarURL",
            "optional": false,
            "description": ""
          }
        ]
      }
    },
    "filename": "api/v1/users/index.js"
  },
  {
    "type": "get",
    "url": "/users/:user_id",
    "title": "Find",
    "name": "Find",
    "version": "1.0.0",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectID",
            "field": "user_id",
            "optional": false,
            "description": "<p>User ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "_id",
            "optional": false,
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "username",
            "optional": false,
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "firstname",
            "optional": false,
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "lastname",
            "optional": false,
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "role",
            "optional": false,
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "avatarURL",
            "optional": false,
            "description": ""
          }
        ]
      }
    },
    "filename": "api/v1/users/index.js"
  },
  {
    "type": "get",
    "url": "/users",
    "title": "FindAll",
    "name": "FindAll",
    "version": "1.0.0",
    "group": "Users",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "field": "users",
            "optional": false,
            "description": "<p>List of users</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "users._id",
            "optional": false,
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "users.username",
            "optional": false,
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "users.firstname",
            "optional": false,
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "users.lastname",
            "optional": false,
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "users.role",
            "optional": false,
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "users.avatarURL",
            "optional": false,
            "description": ""
          }
        ]
      }
    },
    "filename": "api/v1/users/index.js"
  },
  {
    "type": "put",
    "url": "/users/:user_id",
    "title": "Update",
    "name": "Update",
    "version": "1.0.0",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectID",
            "field": "user_id",
            "optional": false,
            "description": "<p>User ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "_id",
            "optional": false,
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "username",
            "optional": false,
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "firstname",
            "optional": false,
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "lastname",
            "optional": false,
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "role",
            "optional": false,
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "avatarURL",
            "optional": false,
            "description": ""
          }
        ]
      }
    },
    "filename": "api/v1/users/index.js"
  },
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "guild.id",
            "optional": false,
            "description": "<p>Guild ID</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "guild.desc",
            "optional": false,
            "description": "<p>Short description</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "guild.link",
            "optional": false,
            "description": "<p>Link to the guild&#39;s page</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "guild.name",
            "optional": false,
            "description": "<p>Guild name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "guild.page",
            "optional": false,
            "description": "<p>Markdown to use for the guild&#39;s home page</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "guild.pic",
            "optional": false,
            "description": "<p>Link to the guild&#39;s index picture</p>"
          }
        ]
      }
    },
    "group": "index_js",
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "api/v1/guilds/index.js"
  },
  {
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "field": "guild_id",
            "optional": false,
            "description": "<p>Guild ID</p>"
          }
        ]
      }
    },
    "group": "index_js",
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "api/v1/guilds/index.js"
  }
] });