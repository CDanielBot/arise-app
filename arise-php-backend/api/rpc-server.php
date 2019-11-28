<?php

require_once '../junior/autoload.php';
require 'db-connect.php';
include 'Mailchimp.php';

// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

class AFCapi {

    public function getContent(array $params) {

        global $afcdb;

        $idCondition = '';
        if(array_key_exists('id', $params)) {
            $idCondition = ' AND ContentId = '.$params['id'];
        }

        $filterConditions = '';
        if(array_key_exists('filter', $params) && count($params['filter']) > 0) {
            foreach($params['filter'] as $filter) {
                $filterConditions .= ' AND Content.'.$filter[0].' '.$filter[1].' \''.$filter[2].'\'';
            }
        }

        $order = ' ORDER BY ';
        if(array_key_exists('sort', $params) && count($params['sort']) > 0) {
            foreach ($params['sort'] as $key => $sField) {
                if(property_exists($sField, 'field')) {
                    $order .= $key == 0 ? 'Content.'.$sField->field : ', Content.'.$sField->field;
                    if(property_exists($sField, 'descending') && $sField->descending) {
                        $order .= ' DESC';
                    }
                }
            }
        }
        else {
            $order .= 'Content.ContentId';
        }

        $limitAndOffset = '';
        if(array_key_exists('page', $params) && property_exists($params['page'], 'size') && property_exists($params['page'], 'offset')) {
            $limitAndOffset = ' LIMIT '.$params['page']->size.' OFFSET '.$params['page']->offset;
        }

        $selectPart = "SELECT Content.ContentId, Content.RelatedContentId, Content.UserId, Content.MediaCollectionId, Content.MediaId, Content.CategoryId, Content.Type, ".$this->appendLang($params['language'], 'Content.Title')." AS Title , ".$this->appendLang($params['language'], 'Content.Description')." AS Description , ".$this->appendLang($params['language'], 'Content.Content')." AS Content, Content.Date, Content.Details, Content.PublishOnDate, Content.Visibility, Content.CreationDate, Media.Type AS MediaType, ".$this->appendLang($params['language'], 'Media.Title')." AS MediaTitle, ".$this->appendLang($params['language'], 'Media.Description')." AS MediaDescription, ".$this->appendLang($params['language'], 'Media.Url')." AS MediaUrl, ".$this->appendLang($params['language'], 'Media.EmbedCode')." AS MediaEmbedCode, MediaCollection.Type AS MediaCollectionType, ".$this->appendLang($params['language'], 'MediaCollection.Title')." AS MediaCollectionTitle, ".$this->appendLang($params['language'], 'MediaCollection.Description')." AS MediaCollectionDescription, MediaCollection.Tags";
        // part 2: // $selectPart = "SELECT Content.*, Media.Type AS MediaType, ".$this->appendLang($params['language'], 'Media.Title')." AS MediaTitle, ".$this->appendLang($params['language'], 'Media.Description')." AS MediaDescription, ".$this->appendLang($params['language'], 'Media.Url')." AS MediaUrl, ".$this->appendLang($params['language'], 'Media.EmbedCode')." AS MediaEmbedCode, MediaCollection.Type AS MediaCollectionType, ".$this->appendLang($params['language'], 'MediaCollection.Title')." AS MediaCollectionTitle, ".$this->appendLang($params['language'], 'MediaCollection.Description')." AS MediaCollectionDescription";
        // $selectPart = "SELECT Content.*, Media.Type AS MediaType, Media.Title AS MediaTitle, Media.Description AS MediaDescription, Media.Url AS MediaUrl, Media.EmbedCode AS MediaEmbedCode, MediaCollection.Type AS MediaCollectionType, MediaCollection.Title AS MediaCollectionTitle, MediaCollection.Description AS MediaCollectionDescription";
        $fromAndJoins = " FROM Content LEFT JOIN Media ON Content.MediaId = Media.MediaId LEFT JOIN MediaCollection ON Content.MediaCollectionId = MediaCollection.CollectionId";
        $conditions = " WHERE 1".$idCondition.$filterConditions;

        $qr = $afcdb->query($selectPart.$fromAndJoins.$conditions.$order.$limitAndOffset);

        $total = $afcdb->queryFirstField("SELECT COUNT(*)".$fromAndJoins.$conditions);

        $result = new stdClass();
        $result->resultset = $qr;
        $result->stats = new stdClass();
        $result->stats->resultset = count($qr);
        $result->stats->total = isset($total) ? $total : count($qr);
        $result->stats->query = $selectPart;
        // var_dump($result);
        return json_encode($result);
    }

    public function getMedia(array $params) {
        global $afcdb;

        $idCondition = '';
        if(array_key_exists('id', $params)) {
            $idCondition = ' AND MediaId = '.$params['id'];
        }

        $filterConditions = '';
        if(array_key_exists('filter', $params) && count($params['filter']) > 0) {
            foreach($params['filter'] as $filter) {
                $filterConditions .= ' AND '.$filter[0].' '.$filter[1].' \''.$filter[2].'\'';
            }
        }

        $tagsFilterConditions = '';
        if(array_key_exists('tags', $params) && count($params['tags']) > 0) {
            $tagsFilterConditions .= ' AND (0';
            foreach($params['tags'] as $tagsFilter) {
                $tagsFilterConditions .= " OR (Tags LIKE '".$tagsFilter."' OR Tags LIKE '".$tagsFilter.",%' OR Tags LIKE '%,".$tagsFilter.",%' OR Tags LIKE '%,".$tagsFilter."')";
            }
            $tagsFilterConditions .= ')';
        }

        if(array_key_exists('requestSource', $params) && $params['requestSource'] == 'cms') {
            $dateCondition = '';
        }
        else {
            $dateCondition = ' AND (DATE(Media.CreationDate) <= CURRENT_DATE)';
        }

        $searchCondition = '';
        if(array_key_exists('search', $params) && $params['search'] != '') {
            $searchCondition = $searchCondition." AND (Media.Title LIKE '%".$params['search']."%' OR Media.Title LIKE '".$params['search']."%' OR Media.Title LIKE '%".$params['search']."' OR Media.Title LIKE '".$params['search']."') ";
        }

        $order = ' ORDER BY ';
        if(array_key_exists('sort', $params) && count($params['sort']) > 0) {
            foreach ($params['sort'] as $key => $sField) {
                if(property_exists($sField, 'field')) {
                    $order .= $key == 0 ? $sField->field : ', '.$sField->field;
                    if(property_exists($sField, 'descending') && $sField->descending) {
                        $order .= ' DESC';
                    }
                }
            }
        }
        else {
            $order .= 'MediaId';
        }

        $limitAndOffset = '';
        if(array_key_exists('page', $params) && property_exists($params['page'], 'size') && property_exists($params['page'], 'offset')) {
            $limitAndOffset = ' LIMIT '.$params['page']->size.' OFFSET '.$params['page']->offset;
        }

        $selectPart = "SELECT *";
        $fromAndJoins = " FROM Media";
        $conditions = " WHERE 1".$idCondition.$dateCondition.$filterConditions.$tagsFilterConditions.$searchCondition;

        $qr = $afcdb->query($selectPart.$fromAndJoins.$conditions.$order.$limitAndOffset);

        $total = $afcdb->queryFirstField("SELECT COUNT(*)".$fromAndJoins.$conditions);

        $result = new stdClass();
        $result->resultset = $qr;
        $result->stats = new stdClass();
        $result->stats->resultset = count($qr);
        $result->stats->total = isset($total) ? $total : count($qr);

        return json_encode($result);
    }

    public function getMediaCollection(array $params) {
        global $afcdb;

        $idCondition = '';
        if(array_key_exists('id', $params)) {
            $idCondition = ' AND CollectionId = '.$params['id'];
        }

        $filterConditions = '';
        if(array_key_exists('filter', $params) && count($params['filter']) > 0) {
            foreach($params['filter'] as $filter) {
                $filterConditions .= ' AND '.$filter[0].' '.$filter[1].' \''.$filter[2].'\'';
            }
        }

        $tagsFilterConditions = '';
        if(array_key_exists('tags', $params) && count($params['tags']) > 0) {
            $tagsFilterConditions .= ' AND (0';
            foreach($params['tags'] as $tagsFilter) {
                $tagsFilterConditions .= " OR (Tags LIKE '".$tagsFilter."' OR Tags LIKE '".$tagsFilter.",%' OR Tags LIKE '%,".$tagsFilter.",%' OR Tags LIKE '%,".$tagsFilter."')";
            }
            $tagsFilterConditions .= ')';
        }

        $searchCondition = '';
        if(array_key_exists('search', $params) && $params['search'] != '') {
            $searchCondition = $searchCondition." AND (MediaCollection.Title LIKE '%".$params['search']."%' OR MediaCollection.Title LIKE '".$params['search']."%' OR MediaCollection.Title LIKE '%".$params['search']."' OR MediaCollection.Title LIKE '".$params['search']."') ";
        }

        $order = ' ORDER BY ';
        if(array_key_exists('sort', $params) && count($params['sort']) > 0) {
            foreach ($params['sort'] as $key => $sField) {
                if(property_exists($sField, 'field')) {
                    $order .= $key == 0 ? $sField->field : ', '.$sField->field;
                    if(property_exists($sField, 'descending') && $sField->descending) {
                        $order .= ' DESC';
                    }
                }
            }
        }
        else {
            $order .= 'CollectionId';
        }

        $limitAndOffset = '';
        if(array_key_exists('page', $params) && property_exists($params['page'], 'size') && property_exists($params['page'], 'offset')) {
            $limitAndOffset = ' LIMIT '.$params['page']->size.' OFFSET '.$params['page']->offset;
        }

        $selectPart = "SELECT *";
        $fromAndJoins = " FROM MediaCollection";
        $conditions = " WHERE 1".$idCondition.$filterConditions.$tagsFilterConditions.$searchCondition;

        $qr = $afcdb->query($selectPart.$fromAndJoins.$conditions.$order.$limitAndOffset);

        $total = $afcdb->queryFirstField("SELECT COUNT(*)".$fromAndJoins.$conditions);

        $result = new stdClass();
        $result->resultset = $qr;
        $result->stats = new stdClass();
        $result->stats->resultset = count($qr);
        $result->stats->total = isset($total) ? $total : count($qr);

        return json_encode($result);
    }

    public function getPost(array $params) {
        global $afcdb;

        $idCondition = '';
        if(array_key_exists('id', $params)) {
            $idCondition = ' AND PostId = '.$params['id'];
        }

        $filterConditions = '';
        if(array_key_exists('filter', $params) && count($params['filter']) > 0) {
            foreach($params['filter'] as $filter) {
                $filterConditions .= ' AND Posts.'.$filter[0].' '.$filter[1].' \''.$filter[2].'\'';
            }
        }

        $filterWithOrCondition = '';
        if(array_key_exists('filterWithOr', $params) && count($params['filterWithOr']) > 0) {
            $filterWithOrCondition = ' OR 1';
            foreach($params['filterWithOr'] as $filter) {
                $filterWithOrCondition .= ' AND Posts.'.$filter[0].' '.$filter[1].' \''.$filter[2].'\'';
            }
        }

        $filterWithOrCondition2 = '';
        if(array_key_exists('filterWithOr2', $params) && count($params['filterWithOr2']) > 0) {
            $filterWithOrCondition2 = ' OR 1';
            foreach($params['filterWithOr2'] as $filter) {
                $filterWithOrCondition2 .= ' AND Posts.'.$filter[0].' '.$filter[1].' \''.$filter[2].'\'';
            }
        }

        if(array_key_exists('requestSource', $params) && $params['requestSource'] == 'cms') {
            $dateCondition = '';
        }
        else {
            $dateCondition = ' AND (DATE(Posts.Date) <= CURRENT_DATE)';
        }

        $searchCondition = '';
        if(array_key_exists('search', $params) && $params['search'] != '') {
            $searchCondition = $searchCondition." AND (Posts.Title LIKE '%".$params['search']."%' OR Posts.Title LIKE '".$params['search']."%' OR Posts.Title LIKE '%".$params['search']."' OR Posts.Title LIKE '".$params['search']."' OR Posts.Description LIKE '%".$params['search']."%' OR Posts.Description LIKE '".$params['search']."%' OR Posts.Description LIKE '%".$params['search']."' OR Posts.Description LIKE '".$params['search']."' OR Posts.Post LIKE '%".$params['search']."%' OR Posts.Post LIKE '".$params['search']."%' OR Posts.Post LIKE '%".$params['search']."' OR Posts.Post LIKE '".$params['search']."') ";
        }

        $order = ' ORDER BY ';
        if(array_key_exists('sort', $params) && count($params['sort']) > 0) {
            foreach ($params['sort'] as $key => $sField) {
                if(property_exists($sField, 'field')) {
                    $order .= $key == 0 ? 'Posts.'.$sField->field : ', Posts.'.$sField->field;
                    if(property_exists($sField, 'descending') && $sField->descending) {
                        $order .= ' DESC';
                    }
                }
            }
        }
        else {
            $order .= 'Posts.PostId';
        }

        $limitAndOffset = '';
        if(array_key_exists('page', $params) && property_exists($params['page'], 'size') && property_exists($params['page'], 'offset')) {
            $limitAndOffset = ' LIMIT '.$params['page']->size.' OFFSET '.$params['page']->offset;
        }

        $postsIdRequired = '';
        $reactions = null;
        if(array_key_exists('userReactedPosts', $params) && $params['userReactedPosts']) {
            $reactions = $afcdb->query("SELECT RelatedPostId FROM Reactions WHERE UserId = '".$params['userId']."'");
            if(count($reactions) > 0) {
                $postsIdRequired = '(';
                foreach($reactions as $key=>$value) {
                    if($key == count($reactions)-1) {
                        $postsIdRequired = $postsIdRequired.(string)$value['RelatedPostId'];
                    }
                    else {
                        $postsIdRequired = $postsIdRequired.(string)$value['RelatedPostId'].',';
                    }
                }
                $postsIdRequired .= ')';
            }
        }
        $selectPart = "SELECT Posts.PostId, Posts.UserId, Posts.MediaId, Posts.MediaCollectionId, Posts.CategoryId, Posts.Type, ".$this->appendLang($params['language'], 'Posts.Title')." AS Title,  ".$this->appendLang($params['language'], 'Posts.Description')." AS Description, ".$this->appendLang($params['language'], 'Posts.Post')." AS Post, Posts.Details, Posts.Author, Posts.Visibility, Posts.Date, Posts.CreationDate, Media.Type AS MediaType, Media.Title AS MediaTitle, Media.Description AS MediaDescription, Media.Url AS MediaUrl, Media.EmbedCode AS MediaEmbedCode, Resources.Url AS ResourceUrl, Resources.Type AS ResourceType, Resources.Title AS ResourceTitle, Users.FirstName AS FirstName, Users.LastName AS LastName, Users.Type AS UserType, Users.MediaUrl AS UserMediaUrl, MediaCollection.Type AS MediaCollectionType, ".$this->appendLang($params['language'], 'MediaCollection.Title')." AS MediaCollectionTitle, ".$this->appendLang($params['language'], 'MediaCollection.Description')." AS MediaCollectionDescription, MediaCollection.Tags AS Tags"; // , MediaCollection.Type AS MediaCollectionType, ".$this->appendLang($params['language'], 'MediaCollection.Title')." AS MediaCollectionTitle, ".$this->appendLang($params['language'], 'MediaCollection.Description')." AS MediaCollectionDescription, MediaCollection.Tags
        $fromAndJoins = " FROM Posts LEFT JOIN Media ON Posts.MediaId = Media.MediaId LEFT JOIN Users ON Posts.UserId = Users.UserId LEFT JOIN MediaCollection ON Posts.MediaCollectionId = MediaCollection.CollectionId LEFT JOIN Resources ON Posts.ResourceId = Resources.ResourceId"; // LEFT JOIN MediaCollection ON Content.MediaCollectionId = MediaCollection.CollectionId
        $conditions = " WHERE ( 1".$idCondition.$dateCondition.$filterConditions.$filterWithOrCondition.$filterWithOrCondition2.$searchCondition." )";
        if(array_key_exists('userReactedPosts', $params) && $params['userReactedPosts']) {
            $conditions = $conditions." AND Posts.PostId IN ".$postsIdRequired;
        }
        $qr = $afcdb->query($selectPart.$fromAndJoins.$conditions.$order.$limitAndOffset);
        foreach ($qr as $key => $post) {
            $relatedPostId = array("RelatedPostId", "=", $post["PostId"]);
            $relatedPostTable = array("RelatedPostTable", "=", "Posts");
            $relatedCommentId = array("RelatedCommentId", "=", "0");
            $commentsFilter = array($relatedPostId, $relatedPostTable, $relatedCommentId);
            $commentsParams = array("filter" => $commentsFilter);
            $qr[$key]['_numberOfReplies'] = json_decode($this->getCommentsNumber($commentsParams))->total;

            $reactionsFilter = array($relatedPostId);
            $reactionsParams = array("filter" => $reactionsFilter);
            $qr[$key]['_reactionsNumber'] = json_decode($this->getReactionsNumber($reactionsParams))->stats->total;

            if(array_key_exists('userId', $params)) {
                $userIdFilter = array("UserId", "=", $params["userId"]);
                $reactionsNumberFilter = array($relatedPostId, $userIdFilter);
                $reactionsNumberParams = array("filter" => $reactionsNumberFilter);
                $qr[$key]['_userLoggedReacted'] = json_decode($this->getReactionsNumber($reactionsNumberParams))->stats->total;
            }
        }
        $conditionsTotal = $conditions;
        $postIdConditionPos = strpos($conditionsTotal, "Posts.PostId = '");
        $postIdCondition = "";
        if($postIdConditionPos != false) {
            for ($pos = $postIdConditionPos + 16; ; $pos++) {
                $postIdCondition = $postIdCondition.$conditionsTotal[$pos];
                if($conditionsTotal[$pos] == "'") {
                    break;
                }
            }
            $abc = "AND Posts.PostId = '".$postIdCondition;
            $conditionsTotal = str_replace($abc, "", $conditionsTotal);
        }
        $total = $afcdb->queryFirstField("SELECT COUNT(*)".$fromAndJoins.$conditionsTotal);

        // $categoriesFilter = null;
        // foreach ($params['filter'] as $filter) {
        //     if($filter[0] == "Type") {
        //         $categoriesFilter = array($filter);
        //     }
        // }
        // $categoriesParams = array("filter" => $categoriesFilter, "language" => $params['language']);
        // $categories = json_decode($this->getCategories($categoriesParams))->resultset;

        $result = new stdClass();
        $result->resultset = $qr;
        // $result->categories = $categories;
        $result->stats = new stdClass();
        $result->stats->resultset = count($qr);
        $result->stats->total = isset($total) ? $total : count($qr);
        $queryTotal = $selectPart.$fromAndJoins.$conditionsTotal.$order.$limitAndOffset;
        $result->stats->query = $conditionsTotal;
        $result->query = $selectPart.$fromAndJoins.$conditions.$order.$limitAndOffset;

        return json_encode($result);
    }

    function getNotificationType($postType){
        if($postType === 'post'){
            return 'prayer';
        }else if($postType === 'media'){
            return 'video';
        }else{
            return $postType; // article / event / image
        }
    }

    function getPostType(array $params){
        $type = null;
        if($params['data']->Type == 'post' || $params['data']->Type == 'article' || $params['data']->Type == 'event'){
            if($params['data']->Type == 'article' || $params['data']->Type == 'event'){
                $type = $params['data']->Type; // article or event
            }else if($params['data']->MediaId){
                $type = 'image'; // image
            }else if(strpos($params['data']->Post,'<iframe') !== false && 
                     strpos($params['data']->Post,'www.youtube.com/embed') !== false){
                $type = 'video'; // video
            }else{
                $type = 'prayer'; // prayer
            }
        
        }else{
            $type = $params['data']->Type;
        }
        return $type;
    }

    public function addPost(array $params) {
        global $afcdb;

        $insertedId = 0;
        $q = null;
		$result = new stdClass();
        if($params['data'] && $params['data']->PostId) {
            $qr = $afcdb->update('Posts', array(
                'UserId' => $params['data']->UserId,
                'CategoryId' => $params['data']->CategoryId,
                'Post' => $params['data']->Post,
                'Post_en' => $params['data']->Post,
                'Visibility' => $params['data']->Visibility,
                'Title' => $params['data']->Title,
                'Title_en' => $params['data']->Title,
                'Description' => $params['data']->Description,
                'Description_en' => $params['data']->Description,
                'Date' => $params['data']->Date,
                'PublishOnDate' => $params['data']->PublishOnDate,
                'MediaId' => $params['data']->MediaId,
                'MediaCollectionId' => $params['data']->MediaCollectionId,
                'Author' => $params['data']->Author
            ), "PostId=%s", $params['data']->PostId);
        }
        else {
            // insert
            $type = getPostType($params)
            $qr = $afcdb->insert('Posts', array(
                'UserId' => $params['data']->UserId,
                'CategoryId' => $params['data']->CategoryId,
                'GroupId' => $params['data']->GroupId,
                'Type' => $params['data']->Type,
                'Type_Mobile' => $type,
                'Post' => $params['data']->Post,
                'Post_en' => $params['data']->Post,
                'Visibility' => $params['data']->Visibility,
                'Title' => $params['data']->Title,
                'Title_en' => $params['data']->Title,
                'Description' => $params['data']->Description,
                'Description_en' => $params['data']->Description,
                'Date' => $params['data']->Date,
                'PublishOnDate' => $params['data']->PublishOnDate,
                'MediaId' => $params['data']->MediaId,
                'MediaCollectionId' => $params['data']->MediaCollectionId,
                'Author' => $params['data']->Author
            ));
            $insertedId = $afcdb->insertId();
            $result->postId = $insertedId;
            
            if($qr && $params['data']->Visibility == '1') {
                $params['data']->Action = getNotificationType($type);
                $params['data']->RelatedPostId = $insertedId;
    
                $result->notificationId = $this->createBroadcastNotification($params);
            }

        }
		
		$result->success = $qr;
		return json_encode($result);
    }

    public function addMedia(array $params) {
        global $afcdb;

        $insertedId = null;
        $q = null;
        if($params['data'] && $params['data']->MediaId) {
            $qr = $afcdb->update('Media', array(
                'MediaCollectionId' => $params['data']->MediaCollectionId,
                'Type' => $params['data']->Type,
                'Title' => $params['data']->Title,
                'Title_en' => $params['data']->Title,
                'Tags' => $params['data']->Tags,
                'Description' => $params['data']->Description,
                'Description_en' => $params['data']->Description,
                'Url' => $params['data']->Url,
                'Url_en' => $params['data']->Url,
                'CreationDate' => $params['data']->CreationDate,
                'EmbedCode' => $params['data']->EmbedCode,
                'EmbedCode_en' => $params['data']->EmbedCode
            ), "MediaId=%s", $params['data']->MediaId);
        }
        else {
            $qr = $afcdb->insert('Media', array(
                'MediaCollectionId' => $params['data']->MediaCollectionId,
                'Type' => $params['data']->Type,
                'Title' => $params['data']->Title,
                'Title_en' => $params['data']->Title,
                'Tags' => $params['data']->Tags,
                'Description' => $params['data']->Description,
                'Description_en' => $params['data']->Description,
                'Url' => $params['data']->Url,
                'Url_en' => $params['data']->Url,
                'CreationDate' => $params['data']->CreationDate,
                'EmbedCode' => $params['data']->EmbedCode,
                'EmbedCode_en' => $params['data']->EmbedCode
            ));
            $insertedId = $afcdb->insertId();
        }

        $result = new stdClass();
        $result->success = $qr;
        $result->insertedId = $insertedId != null ? $insertedId : false;
        // $result->stats = new stdClass();
        // $result->stats->total = $total;

        return json_encode($result);
    }

    public function addMediaCollection(array $params) {
        global $afcdb;

        $insertedId = null;
        $q = null;
        if($params['data'] && $params['data']->CollectionId) {
            $qr = $afcdb->update('MediaCollection', array(
                // 'Type' => $params['data']->Type,
                'Title' => $params['data']->Title,
                'Title_en' => $params['data']->Title,
                // 'Tags' => $params['data']->Tags,
                'Description' => $params['data']->Description,
                'Description_en' => $params['data']->Description,
            ), "CollectionId=%s", $params['data']->CollectionId);

            if($params['data']->Collection) {
                foreach ($params['data']->Collection as $key => $mediaId) {
                    $qr = $afcdb->update('Media', array(
                        'MediaCollectionId' => $params['data']->CollectionId,
                    ), "MediaId=%s", $mediaId);
                }
            }

            $mcqr = $afcdb->update('Posts', array(
                'MediaCollectionId' => $params['data']->CollectionId,
            ), "PostId=%s", $params['relatedPostId']);

        }
        else {
            $qr = $afcdb->insert('MediaCollection', array(
                // 'Type' => $params['data']->Type,
                'Title' => $params['data']->Title,
                'Title_en' => $params['data']->Title,
                // 'Tags' => $params['data']->Tags,
                'Description' => $params['data']->Description,
                'Description_en' => $params['data']->Description
            ));
            $insertedId = $afcdb->insertId();

            if($params['data']->Collection) {
                foreach ($params['data']->Collection as $key => $mediaId) {
                    $qr = $afcdb->update('Media', array(
                        'MediaCollectionId' => $insertedId,
                    ), "MediaId=%s", $mediaId);
                }
            }
            $url = "../img/albums/".$insertedId;
            $dir = mkdir($url, 0777);

            $mcqr = $afcdb->update('Posts', array(
                'MediaCollectionId' => $insertedId,
            ), "PostId=%s", $params['relatedPostId']);
        }

        $result = new stdClass();
        $result->success = $qr;
        $result->dir = $dir;
        $result->url = $url;
        $result->insertedId = $insertedId != null ? $insertedId : false;
        // $result->stats = new stdClass();
        // $result->stats->total = $total;

        return json_encode($result);
    }

    public function addCategory(array $params) {
        global $afcdb;

        $insertedId = null;
        $q = null;
        if($params['data'] && $params['data']->CategoryId) {
            $qr = $afcdb->update('Categories', array(
                'Type' => $params['data']->Type,
                'Name' => $params['data']->Name,
                'Name_en' => $params['data']->Name,
                // 'Description' => $params['data']->Description,
                // 'Description_en' => $params['data']->Description,
                // 'CreationDate' => $params['data']->CreationDate,
            ), "CategoryId=%s", $params['data']->CategoryId);
        }
        else {
            $qr = $afcdb->insert('Categories', array(
                'Type' => $params['data']->Type,
                'Name' => $params['data']->Name,
                'Name_en' => $params['data']->Name,
                // 'Description' => $params['data']->Description,
                // 'Description_en' => $params['data']->Description,
                // 'CreationDate' => $params['data']->CreationDate,
            ));
            $insertedId = $afcdb->insertId();
        }

        $result = new stdClass();
        $result->success = $qr;
        $result->insertedId = $insertedId != null ? $insertedId : false;
        return json_encode($result);
    }

    public function addContact(array $params) {
        global $afcdb;

        $insertedId = null;
        $q = null;
        if($params['data'] && $params['data']->ContactId) {
            $qr = $afcdb->update('Contacts', array(
                'UserId' => $params['data']->UserId,
                'ContactUserId' => $params['data']->ContactUserId,
                'Type' => $params['data']->Type,
                'Name' => $params['data']->Name,
                'Email' => $params['data']->Email,
                'Mobile' => $params['data']->Mobile,
                'Address' => $params['data']->Address,
                'Details' => $params['data']->Details,
                'Stage' => $params['data']->Stage,
                'CreationDate' => $params['data']->CreationDate
            ), "ContactId=%s", $params['data']->ContactId);
        }
        else {
            $qr = $afcdb->insert('Contacts', array(
                'UserId' => $params['data']->UserId,
                'ContactUserId' => $params['data']->ContactUserId,
                'Type' => $params['data']->Type,
                'Name' => $params['data']->Name,
                'Email' => $params['data']->Email,
                'Mobile' => $params['data']->Mobile,
                'Address' => $params['data']->Address,
                'Details' => $params['data']->Details,
                'Stage' => $params['data']->Stage,
                'CreationDate' => $params['data']->CreationDate
            ));
            $insertedId = $afcdb->insertId();
        }

        $result = new stdClass();
        $result->success = $qr;
        $result->insertedId = $insertedId != null ? $insertedId : false;

        return json_encode($result);
    }

    public function getPages(array $params) {
        global $afcdb;

        $idCondition = '';
        if(array_key_exists('id', $params)) {
            $idCondition = ' AND PageId = '.$params['id'];
        }

        $filterConditions = '';
        if(array_key_exists('filter', $params) && count($params['filter']) > 0) {
            foreach($params['filter'] as $filter) {
                $filterConditions .= ' AND '.$filter[0].' '.$filter[1].' \''.$filter[2].'\'';
            }
        }

        $order = ' ORDER BY ';
        if(array_key_exists('sort', $params) && count($params['sort']) > 0) {
            foreach ($params['sort'] as $key => $sField) {
                if(property_exists($sField, 'field')) {
                    $order .= $key == 0 ? $sField->field : ', '.$sField->field;
                    if(property_exists($sField, 'descending') && $sField->descending) {
                        $order .= ' DESC';
                    }
                }
            }
        }
        else {
            $order .= 'PageId';
        }

        $limitAndOffset = '';
        if(array_key_exists('page', $params) && property_exists($params['page'], 'size') && property_exists($params['page'], 'offset')) {
            $limitAndOffset = ' LIMIT '.$params['page']->size.' OFFSET '.$params['page']->offset;
        }

        $selectPart = "SELECT PageId, UserId, CategoryId, Url, Name, Description, MediaUrl, Subscribers, CreationDate";
        $fromAndJoins = " FROM Pages ";
        $conditions = " WHERE 1".$filterConditions;

        $qr = $afcdb->query($selectPart.$fromAndJoins.$conditions.$order.$limitAndOffset);

        $total = $afcdb->queryFirstField("SELECT COUNT(*)".$fromAndJoins.$conditions);

        $result = new stdClass();
        $result->resultset = $qr;
        $result->stats = new stdClass();
        $result->stats->resultset = count($qr);
        $result->stats->total = isset($total) ? $total : count($qr);

        return json_encode($result);
    }

    public function activatePage(array $params) {
        global $afcdb;

        $insertedId = null;
        $q = null;

        $qr = $afcdb->insert('Pages', array(
            'UserId' => $params['data']->UserId,
            'CategoryId' => $params['data']->CategoryId,
            'Name' => $params['data']->Name,
            'Description' => $params['data']->Description,
            'MediaUrl' => $params['data']->MediaUrl,
            'Url' => $params['data']->Url
        ));
        $insertedId = $afcdb->insertId();

        $result = new stdClass();
        $result->success = $qr;
        $result->insertedId = $insertedId != null ? $insertedId : false;

        return json_encode($result);
    }

    public function updatePage(array $params) {
        global $afcdb;
        $q = null;

        $qr = $afcdb->update('Pages', array(
            'UserId' => $params['data']->UserId,
            'CategoryId' => $params['data']->CategoryId,
            'Url' => $params['data']->Url,
            'Name' => $params['data']->Name,
            'Description' => $params['data']->Description,
            'MediaUrl' => $params['data']->MediaUrl,
            'Subscribers' => $params['data']->Subscribers
        ), "PageId=%s", $params['data']->PageId);

        $result = new stdClass();
        $result->success = $qr;

        return json_encode($result);
    }

    public function getGroups(array $params) {
        global $afcdb;

        $idCondition = '';
        if(array_key_exists('id', $params)) {
            $idCondition = ' AND GroupId = '.$params['id'];
        }

        $filterConditions = '';
        if(array_key_exists('filter', $params) && count($params['filter']) > 0) {
            foreach($params['filter'] as $filter) {
                $filterConditions .= ' AND '.$filter[0].' '.$filter[1].' \''.$filter[2].'\'';
            }
        }

        $order = ' ORDER BY ';
        if(array_key_exists('sort', $params) && count($params['sort']) > 0) {
            foreach ($params['sort'] as $key => $sField) {
                if(property_exists($sField, 'field')) {
                    $order .= $key == 0 ? $sField->field : ', '.$sField->field;
                    if(property_exists($sField, 'descending') && $sField->descending) {
                        $order .= ' DESC';
                    }
                }
            }
        }
        else {
            $order .= 'GroupId';
        }

        $limitAndOffset = '';
        if(array_key_exists('page', $params) && property_exists($params['page'], 'size') && property_exists($params['page'], 'offset')) {
            $limitAndOffset = ' LIMIT '.$params['page']->size.' OFFSET '.$params['page']->offset;
        }

        $selectPart = "SELECT GroupId, Type, Privacy, Name, Description, MembersCanPost, CreationDate";
        $fromAndJoins = " FROM Groups ";
        $conditions = " WHERE 1".$filterConditions;

        $qr = $afcdb->query($selectPart.$fromAndJoins.$conditions.$order.$limitAndOffset);

        $total = $afcdb->queryFirstField("SELECT COUNT(*)".$fromAndJoins.$conditions);

        $result = new stdClass();
        $result->resultset = $qr;
        $result->stats = new stdClass();
        $result->stats->resultset = count($qr);
        $result->stats->total = isset($total) ? $total : count($qr);

        return json_encode($result);
    }

    public function getGroup(array $params){

    }

    public function addEditGroup(array $params) {
        global $afcdb;

        $insertedId = null;
        $qr = null;
        if($params['data'] && $params['data']->GroupId) {
            $qr = $afcdb->update('Groups', array(
                'Type' => $params['data']->Type,
                'Name' => $params['data']->Name,
                'Privacy' => $params['data']->Privacy,
                'Description' => $params['data']->Description,
                'MembersCanPost' => $params['data']->MembersCanPost,
                'CreationDate' => $params['data']->CreationDate
            ), "GroupId=%s", $params['data']->GroupId);
        }
        else {
            $qr = $afcdb->insert('Groups', array(
                'Type' => $params['data']->Type,
                'Name' => $params['data']->Name,
                'Privacy' => $params['data']->Privacy,
                'Description' => $params['data']->Description,
                'MembersCanPost' => $params['data']->MembersCanPost
            ));
            $insertedId = $afcdb->insertId();
        }
        $result = new stdClass();
        $result->success = $qr;
        $result->insertedId = $insertedId != null ? $insertedId : false;

        return json_encode($result);
    }

    // public function addGroup(array $params) {
    //     global $afcdb;

    //     $insertedId = null;
    //     $qr = $afcdb->insert('Groups', array(
    //         'Type' => $params['data']->Type,
    //         'Privacy' => $params['data']->Privacy,
    //         'Name' => $params['data']->Name,
    //         'Description' => $params['data']->Description,
    //         'MembersCanPost' => $params['data']->MembersCanPost
    //     ));
    //     $insertedId = $afcdb->insertId();
        
    //     $result = new stdClass();
    //     $result->success = $qr;
    //     $result->insertedId = $insertedId != null ? $insertedId : false;

    //     return json_encode($result);
    // }

    public function deleteGroup(array $params) {
        global $afcdb;

        $qd = $afcdb->query("DELETE FROM Groups WHERE GroupId = %s", $params['GroupId']);
        $uq = $afcdb->query("UPDATE GroupMembers SET GroupId=%i WHERE GroupId=%i", 0, $params['GroupId']);

        $result = new stdClass();
        $result->success = $qd ? true : false;

        return json_encode($result);
    }

    public function getGroupMembers(array $params) {
        global $afcdb;

        $idCondition = '';
        if(array_key_exists('id', $params)) {
            $idCondition = ' AND MemberId = '.$params['id'];
        }

        $filterConditions = '';
        if(array_key_exists('filter', $params) && count($params['filter']) > 0) {
            foreach($params['filter'] as $filter) {
                $filterConditions .= ' AND '.$filter[0].' '.$filter[1].' \''.$filter[2].'\'';
            }
        }

        $order = ' ORDER BY ';
        if(array_key_exists('sort', $params) && count($params['sort']) > 0) {
            foreach ($params['sort'] as $key => $sField) {
                if(property_exists($sField, 'field')) {
                    $order .= $key == 0 ? $sField->field : ', '.$sField->field;
                    if(property_exists($sField, 'descending') && $sField->descending) {
                        $order .= ' DESC';
                    }
                }
            }
        }
        else {
            $order .= 'MemberId';
        }

        $limitAndOffset = '';
        if(array_key_exists('page', $params) && property_exists($params['page'], 'size') && property_exists($params['page'], 'offset')) {
            $limitAndOffset = ' LIMIT '.$params['page']->size.' OFFSET '.$params['page']->offset;
        }

        $selectPart = "SELECT GroupMembers.*, Users.FirstName, Users.LastName, Users.Email, Users.User, Users.Logged, Users.LoggedInApp, Users.MediaUrl";
        $fromAndJoins = " FROM GroupMembers INNER JOIN Users ON Users.UserId = GroupMembers.UserId";
        $conditions = " WHERE 1".$filterConditions;

        $qr = $afcdb->query($selectPart.$fromAndJoins.$conditions.$order.$limitAndOffset);

        $total = $afcdb->queryFirstField("SELECT COUNT(*)".$fromAndJoins.$conditions);

        $result = new stdClass();
        $result->resultset = $qr;
        $result->stats = new stdClass();
        $result->stats->resultset = count($qr);
        $result->stats->total = isset($total) ? $total : count($qr);

        return json_encode($result);
    }

    public function addGroupMember(array $params) {
        global $afcdb;

        $insertedId = null;
        $qr = null;
        if($params['data'] && $params['data']->MemberId) {
            $qr = $afcdb->update('GroupMembers', array(
                'UserId' => $params['data']->UserId,
                'GroupId' => $params['data']->GroupId,
                'Type' => $params['data']->Type,
                'Status' => $params['data']->Status,
                'Banned' => $params['data']->Banned,
                'CreationDate' => $params['data']->CreationDate
            ), "MemberId=%s", $params['data']->MemberId);
        }
        else {
            $qr = $afcdb->insert('GroupMembers', array(
                'UserId' => $params['data']->UserId,
                'GroupId' => $params['data']->GroupId,
                'Type' => $params['data']->Type,
                'Status' => $params['data']->Status,
                'Banned' => $params['data']->Banned
            ));
            $insertedId = $afcdb->insertId();
        }
        $result = new stdClass();
        $result->success = $qr;
        $result->insertedId = $insertedId != null ? $insertedId : false;

        return json_encode($result);
    }

    public function deleteGroupMember(array $params) {
        global $afcdb;

        $qd = $afcdb->query("DELETE FROM GroupMembers WHERE MemberId = %s", $params['MemberId']);

        $result = new stdClass();
        $result->success = $qd ? true : false;

        return json_encode($result);
    }

    public function updateGroupMember(array $params) {
        global $afcdb;
        $q = null;

        $qr = $afcdb->update('GroupMembers', array(
            'UserId' => $params['data']->UserId,
            'GroupId' => $params['data']->GroupId,
            'Type' => $params['data']->Type,
            'Status' => $params['data']->Status,
            'Banned' => $params['data']->Banned
        ), "MemberId=%s", $params['data']->MemberId);

        $result = new stdClass();
        $result->success = $qr;

        return json_encode($result);
    }

    public function activateGroupMembership(array $params){
        
    }

    public function addNote(array $params) {
        global $afcdb;

        $insertedId = null;
        $q = null;
        // NoteId, RelatedEntityId, RelatedEntityType, UserId, Type, Note, Private, CreationDate
        if($params['data'] && $params['data']->NoteId) {
            $qr = $afcdb->update('Notes', array(
                'RelatedEntityId' => $params['data']->RelatedEntityId,
                'RelatedEntityType' => $params['data']->RelatedEntityType,
                'UserId' => $params['data']->UserId,
                'Type' => $params['data']->Type,
                'Note' => $params['data']->Note,
                'Private' => $params['data']->Private,
                'CreationDate' => $params['data']->CreationDate
            ), "NoteId=%s", $params['data']->NoteId);
        }
        else {
            $qr = $afcdb->insert('Notes', array(
                'RelatedEntityId' => $params['data']->RelatedEntityId,
                'RelatedEntityType' => $params['data']->RelatedEntityType,
                'UserId' => $params['data']->UserId,
                'Type' => $params['data']->Type,
                'Note' => $params['data']->Note,
                'Private' => $params['data']->Private,
                'CreationDate' => $params['data']->CreationDate
            ));
            $insertedId = $afcdb->insertId();
        }

        $result = new stdClass();
        $result->success = $qr;
        $result->insertedId = $insertedId != null ? $insertedId : false;

        return json_encode($result);
    }

    public function addEditBibleNote(array $params) {
        global $afcdb;

        $insertedId = null;
        $q = null;
        // NoteId, RelatedEntityId, RelatedEntityType, UserId, Type, Note, Private, CreationDate
        if($params['NoteId'] && $params['NoteId'] != '' && $params['NoteId'] != null) {
            $qr = $afcdb->update('BibleNotes', array(
                'RelatedUserId' => $params['RelatedUserId'],
                'RelatedBookId' => $params['RelatedBookId'],
                'RelatedChapterId' => $params['RelatedChapterId'],
                'RelatedVerseId' => $params['RelatedVerseId'],
                'Note' => $params['Note']
                // 'Private' => $params['Private'],
                // 'CreationDate' => $params['CreationDate']
            ), "NoteId=%s", $params['NoteId']);
        }
        else {
            $qr = $afcdb->insert('BibleNotes', array(
                'RelatedUserId' => $params['RelatedUserId'],
                'RelatedBookId' => $params['RelatedBookId'],
                'RelatedChapterId' => $params['RelatedChapterId'],
                'RelatedVerseId' => $params['RelatedVerseId'],
                'Note' => $params['Note']
            ));
            $insertedId = $afcdb->insertId();
        }

        $result = new stdClass();
        $result->success = $qr;
        if($insertedId != null) {
            $result->insertedId = $insertedId;
        }

        return json_encode($result);
    }

    public function deleteBibleNote(array $params) {
        global $afcdb;

        $qd = $afcdb->query("DELETE FROM BibleNotes WHERE NoteId = %s", $params['NoteId']);

        $result = new stdClass();
        $result->success = $qd ? true : false;

        return json_encode($result);
    }

    public function addEditBibleHighlight(array $params) {
        global $afcdb;

        // $insertedId = null;
        $qr = false;
        foreach ($params['RelatedVersesId'] as $key => $relatedVerseId) {
            // if($params['NoteId'] && $params['NoteId'] != '' && $params['NoteId'] != null) {
            //     $qr = $afcdb->update('BibleHighlights', array(
            //         'RelatedUserId' => $params['RelatedUserId'],
            //         'RelatedVerseId' => $relatedVerseId
            //     ), "NoteId=%s", $params['HighlightId']);
            // }
            // else {
                $qr = $afcdb->insert('BibleHighlights', array(
                    'RelatedUserId' => $params['RelatedUserId'],
                    'RelatedVerseId' => $relatedVerseId
                ));
                // $insertedId = $afcdb->insertId();
            // }

        }


        $result = new stdClass();
        $result->success = $qr;
        // if($insertedId != null) {
        //     $result->insertedId = $insertedId;
        // }

        return json_encode($result);
    }

    public function deleteBibleHighlight(array $params) {
        global $afcdb;

        $qd = null;
        foreach ($params['RelatedVersesId'] as $key => $relatedVerseId) {
            $qd = $afcdb->query("DELETE FROM BibleHighlights WHERE RelatedUserId = %s AND RelatedVerseId = %s", $params['RelatedUserId'], $relatedVerseId);
        }

        $result = new stdClass();
        $result->success = $qd ? true : false;

        return json_encode($result);
    }

    public function deleteCategory(array $params) {
        global $afcdb;

        $qd = $afcdb->query("DELETE FROM Categories WHERE CategoryId = %s", $params['CategoryId']);
        $uq = $afcdb->query("UPDATE Posts SET CategoryId=%i WHERE CategoryId=%i", 0, $params['CategoryId']);

        $result = new stdClass();
        $result->success = $qd ? true : false;

        return json_encode($result);
    }

    public function deleteContact(array $params) {
        global $afcdb;

        $qd = $afcdb->query("DELETE FROM Contacts WHERE ContactId = %s", $params['ContactId']);
        $qd = $afcdb->query("DELETE FROM Notes WHERE RelatedEntityType = 'Contacts' AND RelatedEntityId = %s", $params['ContactId']);

        $result = new stdClass();
        $result->success = $qd ? true : false;

        return json_encode($result);
    }

    public function deleteNote(array $params) {
        global $afcdb;

        $qd = $afcdb->query("DELETE FROM Notes WHERE NoteId = %s", $params['NoteId']);

        $result = new stdClass();
        $result->success = $qd ? true : false;

        return json_encode($result);
    }

    public function deleteMedia(array $params) {
        global $afcdb;

        $qd = $afcdb->query("DELETE FROM Media WHERE MediaId = %s", $params['MediaId']);
        $uq = $afcdb->query("UPDATE Posts SET MediaId=%i WHERE MediaId=%i", 0, $params['MediaId']);

        $deleteSuccess = null;
        if($params['Url']) {
            $deleteSuccess = unlink($params['Url']);
        }
        // delete file from server

        $result = new stdClass();
        $result->success = $qd ? true : false;
        $result->deleteSuccess = $deleteSuccess;

        return json_encode($result);
    }

    public function deleteMediaCollection(array $params) {
        global $afcdb;

        $qd = $afcdb->query("DELETE FROM MediaCollection WHERE CollectionId = %s", $params['CollectionId']);
        $uq = $afcdb->query("UPDATE Posts SET MediaCollectionId=%i WHERE MediaCollectionId=%i", 0, $params['CollectionId']);

        $rmdir = rmdir("../img/albums/".$params['CollectionId']);

        $result = new stdClass();
        $result->rmdir = $rmdir;
        $result->success = $qd ? true : false;

        return json_encode($result);
    }

    public function deletePost(array $params) {
        global $afcdb;

        $qd = $afcdb->query("DELETE FROM Posts WHERE PostId = %s", $params['PostId']);
        $comments = $afcdb->query("SELECT Comments.CommentId, Comments.RelatedPostId, Comments.RelatedCommentId FROM Comments WHERE RelatedPostId = '".$params['PostId']."' AND RelatedCommentId = '0' AND RelatedPostTable = 'Posts'");
        $reactions = $afcdb->query("SELECT Reactions.ReactionId FROM Reactions WHERE RelatedPostId = '".$params['PostId']."' AND RelatedPostTable = 'Posts'");
        foreach ($comments as $key => $comment) {
            $replies = $afcdb->query("SELECT Comments.CommentId, Comments.RelatedPostId, Comments.RelatedCommentId FROM Comments WHERE RelatedPostId = '0' AND RelatedCommentId = '".$comment['CommentId']."'");
            foreach ($replies as $key => $reply) {
                $afcdb->query("DELETE FROM Notifications WHERE RelatedEntityId = '".$reply['CommentId']."' AND RelatedEntityTable = 'Comments' AND Action = 'reply'");
            }
            $afcdb->query("DELETE FROM Comments WHERE RelatedPostId = '0' AND RelatedCommentId = '".$comment['CommentId']."'");
            $afcdb->query("DELETE FROM Comments WHERE CommentId = '".$comment['CommentId']."'");
            $afcdb->query("DELETE FROM Notifications WHERE RelatedEntityId = '".$comment['CommentId']."' AND RelatedEntityTable = 'Comments' AND Action = 'comment'");
        }
        foreach ($reactions as $key => $reaction) {
            $afcdb->query("DELETE FROM Notifications WHERE RelatedEntityId = '".$reaction['ReactionId']."' AND RelatedEntityTable = 'Reactions' AND Action = 'reaction'");
        }
        $afcdb->query("DELETE FROM Reactions WHERE RelatedPostId = '".$params['PostId']."' AND RelatedPostTable = 'Posts' AND Reaction = 'pray'");
        $qdNotification = $afcdb->query("DELETE FROM Notifications WHERE RelatedEntityId = '".$params['PostId']."' AND RelatedEntityTable = 'Posts'");
        $result = new stdClass();
        $result->success = $qd ? true : false;

        return json_encode($result);
    }

    // public function getUserReactedPosts(array $params) {
    //     global $afcdb;

    //     $filterConditions = '';
    //     if(array_key_exists('filter', $params) && count($params['filter']) > 0) {
    //         foreach($params['filter'] as $filter) {
    //             $filterConditions .= ' AND Reactions.'.$filter[0].' '.$filter[1].' \''.$filter[2].'\'';
    //         }
    //     }

    //     $selectPart = "SELECT Reactions.RelatedPostId";
    //     $fromAndJoins = " FROM Reactions";
    //     $conditions = " WHERE 1".$filterConditions;

    //     $qr = $afcdb->query($selectPart.$fromAndJoins.$conditions);

    //     $postsIdRequired = '';
    //     if(count($qr) > 0) {
    //         $postsIdRequired = '(';
    //         foreach($qr as $key=>$value) {
    //             if($key == count($qr)-1) {
    //                 $postsIdRequired = $postsIdRequired.(string)$value['RelatedPostId'];
    //             }
    //             else {
    //                 $postsIdRequired = $postsIdRequired.(string)$value['RelatedPostId'].',';
    //             }
    //         }
    //         $postsIdRequired .= ')';

    //         if(array_key_exists('categoryFilterId', $params) && $params['categoryFilterId']) {
    //             $postsIdRequired = $postsIdRequired . " AND Posts.CategoryId = " . $params['categoryFilterId'];
    //         }

    //         $limitAndOffset = '';
    //         if(array_key_exists('page', $params) && property_exists($params['page'], 'size') && property_exists($params['page'], 'offset')) {
    //             $limitAndOffset = ' LIMIT '.$params['page']->size.' OFFSET '.$params['page']->offset;
    //         }

    //         $order = ' ORDER BY ';
    //         if(array_key_exists('sort', $params) && count($params['sort']) > 0) {
    //             foreach ($params['sort'] as $key => $sField) {
    //                 if(property_exists($sField, 'field')) {
    //                     $order .= $key == 0 ? 'Posts.'.$sField->field : ', Posts.'.$sField->field;
    //                     if(property_exists($sField, 'descending') && $sField->descending) {
    //                         $order .= ' DESC';
    //                     }
    //                 }
    //             }
    //         }
    //         else {
    //             $order .= 'Posts.PostId';
    //         }

    //         $selectPart2 = "SELECT Posts.PostId, Posts.UserId, Posts.MediaId, Posts.MediaCollectionId, Posts.CategoryId, Posts.Type, Posts.Type, Posts.Post, Posts.Visibility, Posts.CreationDate, Media.Type AS MediaType, Media.Title AS MediaTitle, Media.Description AS MediaDescription, Media.Url AS MediaUrl, Media.EmbedCode AS MediaEmbedCode, Users.FirstName AS FirstName, Users.LastName AS LastName, Users.Type AS UserType, Users.MediaUrl AS UserMediaUrl";
    //         $fromAndJoins2 = " FROM Posts LEFT JOIN Media ON Posts.MediaId = Media.MediaId LEFT JOIN Users ON Posts.UserId = Users.UserId";
    //         $conditions2 = " WHERE Posts.PostId IN ".$postsIdRequired;//.$idCondition.$filterConditions;

    //         $posts = $afcdb->query($selectPart2.$fromAndJoins2.$conditions2.$order.$limitAndOffset);
    //         $total = $afcdb->queryFirstField("SELECT COUNT(*)".$fromAndJoins2.$conditions2);


    //         $result = new stdClass();
    //         $result->resultset = $posts;
    //         $result->query = $limitAndOffset;
    //         $result->stats->total = isset($total) ? $total : count($qr);
    //     }
    //     else {
    //         $result = new stdClass();
    //         $result->resultset = array();
    //     }
    //     return json_encode($result);
    // }

    public function getReactions(array $params) {

        global $afcdb;

        $idCondition = '';
        if(array_key_exists('id', $params)) {
            $idCondition = ' AND ContentId = '.$params['id'];
        }

        $filterConditions = '';
        if(array_key_exists('filter', $params) && count($params['filter']) > 0) {
            foreach($params['filter'] as $filter) {
                $filterConditions .= ' AND '.$filter[0].' '.$filter[1].' \''.$filter[2].'\'';
            }
        }

        $searchCondition = '';
        if(array_key_exists('search', $params) && $params['search'] != '') {
            $searchCondition = $searchCondition." AND (Reactions.Name LIKE '%".$params['search']."%' OR Reactions.Name LIKE '".$params['search']."%' OR Reactions.Name LIKE '%".$params['search']."' OR Reactions.Name LIKE '".$params['search']."') ";
        }

        $order = ' ORDER BY ';
        if(array_key_exists('sort', $params) && count($params['sort']) > 0) {
            foreach ($params['sort'] as $key => $sField) {
                if(property_exists($sField, 'field')) {
                    $order .= $key == 0 ? 'Reactions.'.$sField->field : ', Reactions.'.$sField->field;
                    if(property_exists($sField, 'descending') && $sField->descending) {
                        $order .= ' DESC';
                    }
                }
            }
        }
        else {
            $order .= 'Reactions.ReactionId';
        }

        $limitAndOffset = '';
        if(array_key_exists('page', $params) && property_exists($params['page'], 'size') && property_exists($params['page'], 'offset')) {
            $limitAndOffset = ' LIMIT '.$params['page']->size.' OFFSET '.$params['page']->offset;
        }

        $selectPart = "SELECT Reactions.ReactionId, Reactions.UserId, Reactions.RelatedPostId, Reactions.RelatedPostTable, Reactions.Reaction, Reactions.CreationDate, Users.FirstName AS FirstName, Users.LastName AS LastName, Users.MediaUrl AS MediaUrl, Posts.Type AS RelatedPostType";
        $fromAndJoins = " FROM Reactions LEFT JOIN Users ON Reactions.UserId = Users.UserId LEFT JOIN Posts ON Reactions.RelatedPostId = Posts.PostId";
        $conditions = " WHERE 1".$idCondition.$filterConditions.$searchCondition;

        $qr = $afcdb->query($selectPart.$fromAndJoins.$conditions.$order.$limitAndOffset);
        $total = $afcdb->queryFirstField("SELECT COUNT(*)".$fromAndJoins.$conditions);

        $result = new stdClass();
        $result->resultset = $qr;
        $result->stats = new stdClass();
        $result->stats->resultset = count($qr);
        $result->stats->query = $selectPart;
        $result->stats->total = isset($total) ? $total : count($qr);

        return json_encode($result);
    }

    public function getReactionsNumber(array $params) {
        global $afcdb;

        $filterConditions = '';
        if(array_key_exists('filter', $params) && count($params['filter']) > 0) {
            foreach($params['filter'] as $filter) {
                $filterConditions .= ' AND Reactions.'.$filter[0].' '.$filter[1].' \''.$filter[2].'\'';
            }
        }
        $fromAndJoins = " FROM Reactions";
        $conditions = " WHERE 1".$filterConditions;

        $total = $afcdb->queryFirstField("SELECT COUNT(*)".$fromAndJoins.$conditions);
        $result = new stdClass();
		$result->stats = new stdClass();
        $result->stats->total = isset($total) ? $total : count($qr);
        return json_encode($result);
    }

    public function addReaction(array $params) {
        global $afcdb;

        $qr = $afcdb->insert('Reactions', array(
            'UserId' => $params['data']->UserId,
            'RelatedPostId' => $params['data']->RelatedPostId,
            'RelatedPostTable' => 'Posts', // $params['data']->RelatedPostTable,
            'Name' => $params['data']->Name,
            'Reaction' => $params['data']->Reaction,
            'UserMediaUrl' => $params['data']->UserMediaUrl
        ));
        $insertedId = $afcdb->insertId();

        if($qr) {
            $relatedEntity = $afcdb->queryFirstRow("SELECT * FROM ".$params['data']->RelatedPostTable." WHERE PostId=%s", $params['data']->RelatedPostId);

            $params['data']->Action = 'reaction';
            $params['data']->RelatedEntityId = $insertedId;
            $params['data']->RelatedEntityTable = 'Reactions';
            $params['data']->TargetRelatedEntityId = $params['data']->RelatedPostId;
            $params['data']->TargetRelatedEntityTable = $params['data']->RelatedPostTable;
            $params['data']->TargetUserId = ($relatedEntity ? $relatedEntity['UserId'] : '');

            $notification = $this->createPeerToPeerNotification($params);
        }

        $relatedPostId = array("RelatedPostId", "=", $params['data']->RelatedPostId);
        $reactionsFilter = array($relatedPostId);
        $reactionsFilterObj = array("filter" => $reactionsFilter);
        $reactionsNumber = json_decode($this->getReactionsNumber($reactionsFilterObj))->stats->total;

        $result = new stdClass();
        $result->notification = $notification;
        $result->success = $qr;
        $result->reactionsNumber = $reactionsNumber;
        return json_encode($result);
    }

    public function removeReaction(array $params) {
        global $afcdb;

        $reaction = $afcdb->query("SELECT Reactions.ReactionId FROM Reactions WHERE UserId = '".$params['UserId']."' AND RelatedPostId = '".$params['RelatedPostId']."'");
        $qd = $afcdb->query("DELETE FROM Reactions WHERE UserId = %s AND RelatedPostId = %s", $params['UserId'], $params['RelatedPostId']);
        $qdNotification = $afcdb->query("DELETE FROM Notifications WHERE RelatedEntityId = '".$reaction[0]['ReactionId']."' AND RelatedEntityTable = 'Reactions'");

        $relatedPostId = array("RelatedPostId", "=", $params['RelatedPostId']);
        $reactionsFilter = array($relatedPostId);
        $reactionsFilterObj = array("filter" => $reactionsFilter);
        $reactionsNumber = json_decode($this->getReactionsNumber($reactionsFilterObj))->stats->total;

        $result = new stdClass();
        $result->success = $qd ? true : false;
        $result->reactionsNumber = $reactionsNumber;
        return json_encode($result);
    }

    public function deleteReaction(array $params) {
        global $afcdb;

        // $reaction = $afcdb->query("SELECT Reactions.ReactionId FROM Reactions WHERE UserId = '".$params['UserId']."' AND RelatedPostId = '".$params['RelatedPostId']."'");
        $qd = $afcdb->query("DELETE FROM Reactions WHERE ReactionId = '".$params['ReactionId']."'");
        $qdNotification = $afcdb->query("DELETE FROM Notifications WHERE RelatedEntityId = '".$params['ReactionId']."' AND RelatedEntityTable = 'Reactions'");

        // $relatedPostId = array("RelatedPostId", "=", $params['RelatedPostId']);
        // $reactionsFilter = array($relatedPostId);
        // $reactionsFilterObj = array("filter" => $reactionsFilter);
        // $reactionsNumber = json_decode($this->getReactionsNumber($reactionsFilterObj))->stats->total;

        $result = new stdClass();
        $result->success = $qd ? true : false;
        // $result->reactionsNumber = $reactionsNumber;
        return json_encode($result);
    }

    public function selectIfWordExistTest(array $params) {
        global $afcdb;

        $qr = $afcdb->query("SELECT CHARINDEX('vital', )");

        $result = new stdClass();
        $result->total = $total;

        return json_encode($result);
    }

    public function mediaCollectionLength(array $params) {
        global $afcdb;

        $filterConditions = '';
        if(array_key_exists('filter', $params) && count($params['filter']) > 0) {
            foreach($params['filter'] as $filter) {
                $filterConditions .= ' AND '.$filter[0].' '.$filter[1].' \''.$filter[2].'\'';
            }
        }

        $fromAndJoins = " FROM Media";
        $conditions = " WHERE 1".$filterConditions;

        $total = $afcdb->queryFirstField("SELECT COUNT(*)".$fromAndJoins.$conditions);

        $result = new stdClass();
        $result->total = $total;

        return json_encode($result);
    }

    public function getCategories(array $params) {
        global $afcdb;

        $idCondition = '';
        if(array_key_exists('id', $params)) {
            $idCondition = ' AND CategoryId = '.$params['id'];
        }

        $filterConditions = '';
        if(array_key_exists('filter', $params) && count($params['filter']) > 0) {
            foreach($params['filter'] as $filter) {
                $filterConditions .= ' AND Categories.'.$filter[0].' '.$filter[1].' \''.$filter[2].'\'';
            }
        }

        $order = ' ORDER BY ';
        if(array_key_exists('sort', $params) && count($params['sort']) > 0) {
            foreach ($params['sort'] as $key => $sField) {
                if(property_exists($sField, 'field')) {
                    $order .= $key == 0 ? $sField->field : ', '.$sField->field;
                    if(property_exists($sField, 'descending') && $sField->descending) {
                        $order .= ' DESC';
                    }
                }
            }
        }
        else {
            $order .= 'Position, CategoryId';
        }

        $limitAndOffset = '';
        if(array_key_exists('page', $params) && property_exists($params['page'], 'size') && property_exists($params['page'], 'offset')) {
            $limitAndOffset = ' LIMIT '.$params['page']->size.' OFFSET '.$params['page']->offset;
        }

        $selectPart = "SELECT Categories.CategoryId, Categories.Type, Categories.".$this->appendLang($params['language'], 'Name')." AS Name, Categories.".$this->appendLang($params['language'], 'Description')." AS Description, Categories.Visibility, Categories.Position, Categories.CreationDate, Media.".$this->appendLang($params['language'], 'Url')." AS MediaUrl";
        $fromAndJoins = " FROM Categories LEFT JOIN Media ON Categories.MediaId = Media.MediaId ";
        $conditions = " WHERE 1".$filterConditions;

        $qr = $afcdb->query($selectPart.$fromAndJoins.$conditions.$order.$limitAndOffset);

        //$total = $afcdb->queryFirstField("SELECT COUNT(*)".$fromAndJoins.$conditions);

        $result = new stdClass();
        $result->resultset = $qr;
        $result->stats = new stdClass();
        $result->stats->resultset = count($qr);
        $result->stats->total = isset($total) ? $total : count($qr);

        return json_encode($result);
    }

    public function getNotes(array $params) {
        global $afcdb;

        $idCondition = '';
        if(array_key_exists('id', $params)) {
            $idCondition = ' AND NoteId = '.$params['id'];
        }

        $filterConditions = '';
        if(array_key_exists('filter', $params) && count($params['filter']) > 0) {
            foreach($params['filter'] as $filter) {
                $filterConditions .= ' AND '.$filter[0].' '.$filter[1].' \''.$filter[2].'\'';
            }
        }

        $order = ' ORDER BY ';
        if(array_key_exists('sort', $params) && count($params['sort']) > 0) {
            foreach ($params['sort'] as $key => $sField) {
                if(property_exists($sField, 'field')) {
                    $order .= $key == 0 ? $sField->field : ', '.$sField->field;
                    if(property_exists($sField, 'descending') && $sField->descending) {
                        $order .= ' DESC';
                    }
                }
            }
        }
        else {
            $order .= 'NoteId';
        }

        $limitAndOffset = '';
        if(array_key_exists('page', $params) && property_exists($params['page'], 'size') && property_exists($params['page'], 'offset')) {
            $limitAndOffset = ' LIMIT '.$params['page']->size.' OFFSET '.$params['page']->offset;
        }

        $selectPart = "SELECT NoteId, RelatedEntityId, RelatedEntityType, UserId, Type, Note, Private, CreationDate";
        $fromAndJoins = " FROM Notes ";
        $conditions = " WHERE 1".$filterConditions;

        $qr = $afcdb->query($selectPart.$fromAndJoins.$conditions.$order.$limitAndOffset);

        $total = $afcdb->queryFirstField("SELECT COUNT(*)".$fromAndJoins.$conditions);

        $result = new stdClass();
        $result->resultset = $qr;
        $result->stats = new stdClass();
        $result->stats->resultset = count($qr);
        $result->stats->total = isset($total) ? $total : count($qr);

        return json_encode($result);
    }

    public function getBibleNotes(array $params) {
        global $afcdb;

        $idCondition = '';
        if(array_key_exists('id', $params)) {
            $idCondition = ' AND NoteId = '.$params['id'];
        }

        $filterConditions = '';
        if(array_key_exists('filter', $params) && count($params['filter']) > 0) {
            foreach($params['filter'] as $filter) {
                $filterConditions .= ' AND '.$filter[0].' '.$filter[1].' \''.$filter[2].'\'';
            }
        }

        $order = ' ORDER BY ';
        if(array_key_exists('sort', $params) && count($params['sort']) > 0) {
            foreach ($params['sort'] as $key => $sField) {
                if(property_exists($sField, 'field')) {
                    $order .= $key == 0 ? $sField->field : ', '.$sField->field;
                    if(property_exists($sField, 'descending') && $sField->descending) {
                        $order .= ' DESC';
                    }
                }
            }
        }
        else {
            $order .= 'NoteId';
        }

        $limitAndOffset = '';
        if(array_key_exists('page', $params) && property_exists($params['page'], 'size') && property_exists($params['page'], 'offset')) {
            $limitAndOffset = ' LIMIT '.$params['page']->size.' OFFSET '.$params['page']->offset;
        }

        $selectPart = "SELECT NoteId, RelatedBookId, RelatedUserId, RelatedChapterId, RelatedVerseId, Note, CreationDate";
        $fromAndJoins = " FROM BibleNotes ";
        $conditions = " WHERE 1".$filterConditions;

        $qr = $afcdb->query($selectPart.$fromAndJoins.$conditions.$order.$limitAndOffset);

        $total = $afcdb->queryFirstField("SELECT COUNT(*)".$fromAndJoins.$conditions);

        $result = new stdClass();
        $result->resultset = $qr;
        $result->stats = new stdClass();
        $result->stats->resultset = count($qr);
        $result->stats->total = isset($total) ? $total : count($qr);

        return json_encode($result);
    }

    public function getBibleHighlights(array $params) {
        global $afcdb;

        $idCondition = '';
        if(array_key_exists('id', $params)) {
            $idCondition = ' AND HighlightId = '.$params['id'];
        }

        $filterConditions = '';
        if(array_key_exists('filter', $params) && count($params['filter']) > 0) {
            foreach($params['filter'] as $filter) {
                $filterConditions .= ' AND '.$filter[0].' '.$filter[1].' \''.$filter[2].'\'';
            }
        }

        $order = ' ORDER BY ';
        if(array_key_exists('sort', $params) && count($params['sort']) > 0) {
            foreach ($params['sort'] as $key => $sField) {
                if(property_exists($sField, 'field')) {
                    $order .= $key == 0 ? $sField->field : ', '.$sField->field;
                    if(property_exists($sField, 'descending') && $sField->descending) {
                        $order .= ' DESC';
                    }
                }
            }
        }
        else {
            $order .= 'HighlightId';
        }

        $limitAndOffset = '';
        if(array_key_exists('page', $params) && property_exists($params['page'], 'size') && property_exists($params['page'], 'offset')) {
            $limitAndOffset = ' LIMIT '.$params['page']->size.' OFFSET '.$params['page']->offset;
        }

        $selectPart = "SELECT HighlightId, RelatedUserId, RelatedVerseId, CreationDate";
        $fromAndJoins = " FROM BibleHighlights ";
        $conditions = " WHERE 1".$filterConditions;

        $qr = $afcdb->query($selectPart.$fromAndJoins.$conditions.$order.$limitAndOffset);

        $total = $afcdb->queryFirstField("SELECT COUNT(*)".$fromAndJoins.$conditions);

        $result = new stdClass();
        $result->resultset = $qr;
        $result->stats = new stdClass();
        $result->stats->resultset = count($qr);
        $result->stats->total = isset($total) ? $total : count($qr);

        return json_encode($result);
    }

    public function getChapter(array $params) {
        global $afcdb;

        $idCondition = '';
        if(array_key_exists('id', $params)) {
            $idCondition = ' AND VerseId = '.$params['id'];
        }

        $filterConditions = '';
        if(array_key_exists('filter', $params) && count($params['filter']) > 0) {
            foreach($params['filter'] as $filter) {
                $filterConditions .= ' AND BibleText.'.$filter[0].' '.$filter[1].' \''.$filter[2].'\'';
            }
        }

        if(!property_exists($params, 'bibleVersion')) {
            $params['bibleVersion'] = 'BTF';
        }
        $searchCondition = '';
        if(array_key_exists('search', $params) && $params['search'] != '') {
            $searchCondition = $searchCondition." AND (BibleText.VerseText_".$params['bibleVersion']." LIKE '%".$params['search']."%' OR BibleText.VerseText_".$params['bibleVersion']." LIKE '".$params['search']."%' OR BibleText.VerseText_".$params['bibleVersion']." LIKE '%".$params['search']."' OR BibleText.VerseText_".$params['bibleVersion']." LIKE '".$params['search']."') ";
        }

        $order = ' ORDER BY ';
        if(array_key_exists('sort', $params) && count($params['sort']) > 0) {
            foreach ($params['sort'] as $key => $sField) {
                if(property_exists($sField, 'field')) {
                    $order .= $key == 0 ? $sField->field : ', '.$sField->field;
                    if(property_exists($sField, 'asc') && $sField->descending) {
                        $order .= ' DESC';
                    }
                }
            }
        }
        else {
            $order .= 'VerseNo';
        }

        $limitAndOffset = '';
        if(array_key_exists('page', $params) && property_exists($params['page'], 'size') && property_exists($params['page'], 'offset')) {
            $limitAndOffset = ' LIMIT '.$params['page']->size.' OFFSET '.$params['page']->offset;
        }

        $selectPart = "SELECT * FROM BibleText";
        $fromAndJoins = "";
        $conditions = " WHERE 1".$filterConditions.$searchCondition;

        $qr = $afcdb->query($selectPart.$fromAndJoins.$conditions.$order.$limitAndOffset);
        $qrBooks = $afcdb->query("SELECT * FROM BibleBooks ORDER BY BookId ASC");
        $total = $afcdb->queryFirstField("SELECT COUNT(*) FROM BibleText ".$fromAndJoins.$conditions);

        $result = new stdClass();
        $result->resultset = $qr;
        $result->books = $qrBooks;
        $result->totalVersesNumber = $total;
        $result->stats = new stdClass();
        $result->stats->resultset = count($qr);
        $result->stats->total = isset($total) ? $total : count($qr);

        return json_encode($result);
    }

    public function getContacts(array $params) {
        global $afcdb;

        $idCondition = '';
        if(array_key_exists('id', $params)) {
            $idCondition = ' AND ContactId = '.$params['id'];
        }

        $filterConditions = '';
        if(array_key_exists('filter', $params) && count($params['filter']) > 0) {
            foreach($params['filter'] as $filter) {
                $filterConditions .= ' AND '.$filter[0].' '.$filter[1].' \''.$filter[2].'\'';
            }
        }

        $order = ' ORDER BY ';
        if(array_key_exists('sort', $params) && count($params['sort']) > 0) {
            foreach ($params['sort'] as $key => $sField) {
                if(property_exists($sField, 'field')) {
                    $order .= $key == 0 ? $sField->field : ', '.$sField->field;
                    if(property_exists($sField, 'descending') && $sField->descending) {
                        $order .= ' DESC';
                    }
                }
            }
        }
        else {
            $order .= 'ContactId';
        }

        $limitAndOffset = '';
        if(array_key_exists('page', $params) && property_exists($params['page'], 'size') && property_exists($params['page'], 'offset')) {
            $limitAndOffset = ' LIMIT '.$params['page']->size.' OFFSET '.$params['page']->offset;
        }

        $searchCondition = '';
        if(array_key_exists('search', $params) && $params['search'] != '') {
            $searchCondition = $searchCondition." AND (Contacts.Name LIKE '%".$params['search']."%' OR Contacts.Name LIKE '".$params['search']."%' OR Contacts.Name LIKE '%".$params['search']."' OR Contacts.Name LIKE '".$params['search']."' OR Contacts.Email LIKE '%".$params['search']."%' OR Contacts.Email LIKE '".$params['search']."%' OR Contacts.Email LIKE '%".$params['search']."' OR Contacts.Email LIKE '".$params['search']."' OR Contacts.Mobile LIKE '%".$params['search']."%' OR Contacts.Mobile LIKE '".$params['search']."%' OR Contacts.Mobile LIKE '%".$params['search']."' OR Contacts.Mobile LIKE '".$params['search']."') ";
        }

        $selectPart = "SELECT ContactId, UserId, ContactUserId, Type, Name, Email, Mobile, Address, Details, Stage, LastUpdated, CreationDate";
        $fromAndJoins = " FROM Contacts ";
        $conditions = " WHERE 1".$filterConditions.$searchCondition;

        $qr = $afcdb->query($selectPart.$fromAndJoins.$conditions.$order.$limitAndOffset);

        $total = $afcdb->queryFirstField("SELECT COUNT(*)".$fromAndJoins.$conditions);

        $result = new stdClass();
        $result->resultset = $qr;
        $result->stats = new stdClass();
        $result->stats->resultset = count($qr);
        $result->stats->total = isset($total) ? $total : count($qr);

        return json_encode($result);
    }


    public function getUsers(array $params) {
        global $afcdb;

        $idCondition = '';
        if(array_key_exists('id', $params)) {
            $idCondition = ' AND UserId = '.$params['id'];
        }

        $filterConditions = '';
        if(array_key_exists('filter', $params) && count($params['filter']) > 0) {
            foreach($params['filter'] as $filter) {
                $filterConditions .= ' AND '.$filter[0].' '.$filter[1].' \''.$filter[2].'\'';
            }
        }

        $searchCondition = '';
        if(array_key_exists('search', $params) && $params['search'] != '') {
            $searchCondition = $searchCondition." AND (Users.FirstName LIKE '%".$params['search']."%' OR Users.FirstName LIKE '".$params['search']."%' OR Users.FirstName LIKE '%".$params['search']."' OR Users.FirstName LIKE '".$params['search']."' OR Users.LastName LIKE '%".$params['search']."%' OR Users.LastName LIKE '".$params['search']."%' OR Users.LastName LIKE '%".$params['search']."' OR Users.LastName LIKE '".$params['search']."' OR Users.User LIKE '%".$params['search']."%' OR Users.User LIKE '".$params['search']."%' OR Users.User LIKE '%".$params['search']."' OR Users.User LIKE '".$params['search']."') ";
        }

        $order = ' ORDER BY ';
        if(array_key_exists('sort', $params) && count($params['sort']) > 0) {
            foreach ($params['sort'] as $key => $sField) {
                if(property_exists($sField, 'field')) {
                    $order .= $key == 0 ? $sField->field : ', '.$sField->field;
                    if(property_exists($sField, 'descending') && $sField->descending) {
                        $order .= ' DESC';
                    }
                }
            }
        }
        else {
            $order .= 'UserId';
        }

        $limitAndOffset = '';
        if(array_key_exists('page', $params) && property_exists($params['page'], 'size') && property_exists($params['page'], 'offset')) {
            $limitAndOffset = ' LIMIT '.$params['page']->size.' OFFSET '.$params['page']->offset;
        }

        $selectPart = "SELECT UserId, FirstName, LastName, Mobile, Email, User, Description, Type, Zone, Country, Logged, LastLogin, Banned, Language, MediaUrl, CreationDate";
        $fromAndJoins = " FROM Users";
        $conditions = " WHERE 1".$idCondition.$filterConditions.$searchCondition;

        $qr = $afcdb->query($selectPart.$fromAndJoins.$conditions.$order.$limitAndOffset);

        $total = $afcdb->queryFirstField("SELECT COUNT(*)".$fromAndJoins.$conditions);

        $result = new stdClass();
        $result->resultset = $qr;
        $result->stats = new stdClass();
        $result->stats->resultset = count($qr);
        $result->stats->total = isset($total) ? $total : count($qr);

        return json_encode($result);
    }

    public function searchUsers(array $params) {
        global $afcdb;

        $idCondition = '';
        if(array_key_exists('id', $params)) {
            $idCondition = ' AND UserId = '.$params['id'];
        }

        $filterConditions = '';
        if(array_key_exists('filter', $params) && count($params['filter']) > 0) {
            foreach($params['filter'] as $filter) {
                $filterConditions .= ' AND '.$filter[0].' '.$filter[1].' \''.$filter[2].'\'';
            }
        }

        $order = ' ORDER BY ';
        if(array_key_exists('sort', $params) && count($params['sort']) > 0) {
            foreach ($params['sort'] as $key => $sField) {
                if(property_exists($sField, 'field')) {
                    $order .= $key == 0 ? $sField->field : ', '.$sField->field;
                    if(property_exists($sField, 'descending') && $sField->descending) {
                        $order .= ' DESC';
                    }
                }
            }
        }
        else {
            $order .= 'UserId';
        }

        $limitAndOffset = '';
        if(array_key_exists('page', $params) && property_exists($params['page'], 'size') && property_exists($params['page'], 'offset')) {
            $limitAndOffset = ' LIMIT '.$params['page']->size.' OFFSET '.$params['page']->offset;
        }

        $selectPart = "SELECT UserId, FirstName, LastName, Email, User, MediaUrl";
        $fromAndJoins = " FROM Users";
        $conditions = " WHERE UserId != 1".$idCondition.$filterConditions;

        $qr = $afcdb->query($selectPart.$fromAndJoins.$conditions.$order.$limitAndOffset);

        $total = $afcdb->queryFirstField("SELECT COUNT(*)".$fromAndJoins.$conditions);

        $result = new stdClass();
        $result->resultset = $qr;
        $result->stats = new stdClass();
        $result->stats->resultset = count($qr);
        $result->stats->total = isset($total) ? $total : count($qr);

        return json_encode($result);
    }

    public function userLogin(array $params) {
        global $afcdb;

        $select = "SELECT UserId, FirstName, LastName, Mobile, Email, User, Password, Type, Zone, Country, Logged, Description, LastLogin, Banned, Language, MediaUrl, CreationDate FROM Users WHERE User=%s AND Banned = 0";
        if(property_exists($params['data'], 'Type') && $params['data']->Type == '0') {
            $select = $select." AND Type = 0";
        }
        $user = $afcdb->queryFirstRow($select, $params['data']->User);

        $userLogged = false;

        // $_SESSION['auth'] = 'genericAuthToken';
        if($user && password_verify($params['data']->Password, $user['Password'])) {
            // check if user has active session and if not create one


            // $_SESSION['UserId'] = $user['UserId'];
            // $_SESSION['FirstName'] = $user['FirstName'];
            // $_SESSION['LastName'] = $user['LastName'];
            // $_SESSION['Mobile'] = $user['Mobile'];
            // $_SESSION['Email'] = $user['Email'];
            // $_SESSION['User'] = $user['User'];
            // $_SESSION['Type'] = $user['Type'];
            // $_SESSION['Logged'] = $user['Logged'];
            // $_SESSION['LastLogin'] = $user['LastLogin'];
            // $_SESSION['Banned'] = $user['Banned'];
            // $_SESSION['Language'] = $user['Language'];
            // $_SESSION['MediaId'] = $user['MediaId'];
            // $_SESSION['CreationDate'] = $user['CreationDate'];

            // $user['auth'] = 'genericAuthToken';
            $uq = $afcdb->query("UPDATE Users SET Logged=%i, LastLogin=%t WHERE UserId=%i", 1, date('Y-m-d H:i:s'), $user['UserId']);

            $userLogged = true;
        }

        $result = new stdClass();

        $result->logged = $userLogged;
        $result->userData = $user;
        $result->selectPart = $select;

        return json_encode($result);
    }

    public function userLoginInApp(array $params) {
        global $afcdb;

        $select = "SELECT UserId, FirstName, LastName, Mobile, Email, User, Password, Type, Zone, Description, Country, LoggedInApp, LastLogin, Banned, Language, MediaUrl, CreationDate FROM Users WHERE User=%s AND Banned = 0";

        $user = $afcdb->queryFirstRow($select, $params['data']->User);

        $userLogged = false;

        // $_SESSION['auth'] = 'genericAuthToken';
        if($user && password_verify($params['data']->Password, $user['Password'])) {
            // check if user has active session and if not create one

            // $user['auth'] = 'genericAuthToken';
            $uq = $afcdb->query("UPDATE Users SET LoggedInApp=%i, LastLogin=%t WHERE UserId=%i", 1, date('Y-m-d H:i:s'), $user['UserId']);

            $userLogged = true;
        }

        $result = new stdClass();

        $result->logged = $userLogged;
        $result->userData = $user;

        return json_encode($result);
    }

    public function checkUsername(array $params) {
        global $afcdb;

        $select = "SELECT COUNT(*) AS total FROM Users WHERE User=%s";
        $total = $afcdb->queryFirstRow($select, $params['user']);

        $result = new stdClass();
        $result->stats = $total;

        return json_encode($result);
    }

    public function userLogout(array $params) {
        // session_unset();
        global $afcdb;

        // delete user session
        $uq = $afcdb->query("UPDATE Users SET Logged=%i WHERE UserId=%i", 0, $params['data']->UserId);

        $result = new stdClass();

        $result->loggedOut = true;

        return json_encode($result);
    }

    public function userLogoutInApp(array $params) {
        // session_unset();
        global $afcdb;

        // delete user session
        $uq = $afcdb->query("UPDATE Users SET LoggedInApp=%i WHERE UserId=%i", 0, $params['data']->UserId);

        $result = new stdClass();

        $result->loggedOut = true;

        return json_encode($result);
    }

    public function facebookUserLogout(array $params) {
        // session_unset();
        global $afcdb;

        // delete user session
        $uq = $afcdb->query("UPDATE Users SET Logged=%i WHERE FacebookId=%i", 0, $params['data']->FacebookId);

        $result = new stdClass();

        $result->loggedOut = true;

        return json_encode($result);
    }

    public function registerUser(array $params) {
        global $afcdb;

        $password = password_hash($params['data']->Password, PASSWORD_DEFAULT);
        $qr = $afcdb->insert('Users', array(
            'User' => $params['data']->User,
            'FirstName' => $params['data']->FirstName,
            'LastName' => $params['data']->LastName,
            'Email' => $params['data']->Email,
            'Mobile' => $params['data']->Mobile,
            'Password' => $password,
            'Language' => $params['data']->Language,
            'MediaUrl' => $params['data']->MediaUrl
        ));

        $mr = false;
        if(array_key_exists('sendEmail', $params) && $params['sendEmail']) {
            $to = $params['data']->Email;

            $subject = 'Cont Arise for Christ';
            $message = $params['data']->EmailContent;

            // $headers .= 'To: Arise for Christ <' . $to . '>' . "\r\n";
            $headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";
            $headers .= 'From: Arise for Christ <info@ariseforchrist.com>' . "\r\n";
            $headers .= 'Reply-To: info@ariseforchrist.com' . "\r\n";
            $headers .= 'X-Mailer: PHP/' . phpversion();

            $mr = mail($to, $subject, $message, $headers);
        }

        $result = new stdClass();
        $result->success = $qr;
        $result->mail = $mr;

        return json_encode($result);
    }

    public function registerEvangelist(array $params) {
        global $afcdb;

        $password = password_hash($params['data']->Password, PASSWORD_DEFAULT);
        $qr = $afcdb->insert('Users', array(
            'User' => $params['data']->User,
            'FirstName' => $params['data']->FirstName,
            'LastName' => $params['data']->LastName,
            'Email' => $params['data']->Email,
            'Mobile' => $params['data']->Phone,
            'Password' => $password,
            'Language' => $params['data']->Language,
            'Country' => $params['data']->Country,
            'Zone' => $params['data']->Zone,
            'Type' => 2
        ));
        $insertedId = $afcdb->insertId();

        $mrUser = false;
        $mrAfc = false;
        if(array_key_exists('sendEmail', $params) && $params['sendEmail']) {
            $toUser = $params['data']->Email;
            $toAfc = 'info@ariseforchrist.com';

            $subject = 'Implicare in evanghelizare personala Arise for Christ';
            $messageUser = $params['data']->EmailForUser;
            $messageAfc = $params['data']->EmailForAfc;

            // $headers .= 'To: Arise for Christ <' . $to . '>' . "\r\n";
            $headers = 'Content-type: text/html; charset=utf-8' . "\r\n";
            $headers .= 'From: Arise for Christ <info@ariseforchrist.com>' . "\r\n";
            $headers .= 'Reply-To: info@ariseforchrist.com' . "\r\n";
            $headers .= 'X-Mailer: PHP/' . phpversion();

            $mrUser = mail($toUser, $subject, $messageUser, $headers);
            $mrAfc = mail($toAfc, $subject, $messageAfc, $headers);
        }

        $details =  'Language: '.$params['data']->Language."\r\n".
                    'Country: '.$params['data']->Country."\r\n".
                    'Zone: '.$params['data']->Zone."\r\n";
        $contactsQr = $afcdb->insert('Contacts', array(
            'UserId' => $insertedId,
            'ContactUserId' => '0',
            'Type' => '2',
            'Name' => ($params['data']->FirstName." ".$params['data']->LastName),
            'Email' => $params['data']->Email,
            'Mobile' => $params['data']->Phone,
            'Address' => '',
            'Stage' => '1',
            'Details' => $details
        ));

        $result = new stdClass();
        $result->success = $qr;
        $result->contactsuccess = $contactsQr;
        $result->userMail = $mrUser;
        $result->afcMail = $mrAfc;

        return json_encode($result);
    }

    public function updateUserAsEvangelist(array $params) {
        global $afcdb;

        $uq = $afcdb->query("UPDATE Users SET FirstName=%s, LastName=%s, Mobile=%s, Email=%s, Zone=%s, Country=%s, Type=%i WHERE UserId=%i", $params['data']->FirstName, $params['data']->LastName, $params['data']->Phone, $params['data']->Email, $params['data']->Zone, $params['data']->Country, 2, $params['data']->UserId);

        $mrUser = false;
        $mrAfc = false;
        if(array_key_exists('sendEmail', $params) && $params['sendEmail']) {
            $toUser = $params['data']->Email;
            $toAfc = 'info@ariseforchrist.com';

            $subject = 'Misionar Arise for Christ';
            $messageUser = $params['data']->EmailForUser;
            $messageAfc = $params['data']->EmailForAfc;

            // $headers .= 'To: Arise for Christ <' . $to . '>' . "\r\n";
            $headers = 'Content-type: text/html; charset=utf-8' . "\r\n";
            $headers .= 'From: Arise for Christ <info@ariseforchrist.com>' . "\r\n";
            $headers .= 'Reply-To: info@ariseforchrist.com' . "\r\n";
            $headers .= 'X-Mailer: PHP/' . phpversion();

            $mrUser = mail($toUser, $subject, $messageUser, $headers);
            $mrAfc = mail($toAfc, $subject, $messageAfc, $headers);
        }

        $details = '';
        if($params['data']->Language) {
            $details = 'Language: '.$params['data']->Language."\r\n";
        }
        $details = $details.
                    // 'Language: '.$params['data']->Language."\r\n".
                    'Country: '.$params['data']->Country."\r\n".
                    'Zone: '.$params['data']->Zone."\r\n";
        $contactsQr = $afcdb->insert('Contacts', array(
            'UserId' => $params['data']->UserId,
            'ContactUserId' => '0',
            'Type' => '2',
            'Name' => ($params['data']->FirstName." ".$params['data']->LastName),
            'Email' => $params['data']->Email,
            'Mobile' => $params['data']->Phone,
            'Address' => '',
            'Stage' => '1',
            'Details' => $details
        ));

        $result = new stdClass();
        $result->success = $uq;
        $result->userMail = $mrUser;
        $result->afcMail = $mrAfc;

        return json_encode($result);
    }

    public function updateUserLanguage(array $params) {
        global $afcdb;

        $uq = $afcdb->query("UPDATE Users SET Language=%s WHERE UserId=%i", $params['data']->Language, $params['data']->UserId);

        $result = new stdClass();
        $result->languageUpdated = true;

        return json_encode($result);
    }

    public function updateUser(array $params) {
        global $afcdb;

        $select = "SELECT User FROM Users WHERE User=%s";
        $user = $afcdb->queryFirstRow($select, $params['data']->User);

        if($user) {
            $result = new stdClass();
            $result->success = false;
            $result->usernameExist = true;
            return json_encode($result);
        }
        else {
            if($params['data']->User) {
                $uq = $afcdb->query("UPDATE Users SET FirstName=%s, LastName=%s, Mobile=%s, Description=%s, Zone=%s, Country=%s, MediaUrl=%s, User=%s, Type=%s, Email=%s, Language=%s, Banned=%s WHERE UserId=%i", $params['data']->FirstName, $params['data']->LastName, $params['data']->Mobile, $params['data']->Description, $params['data']->Zone, $params['data']->Country, $params['data']->MediaUrl, $params['data']->User, $params['data']->Type, $params['data']->Email, $params['data']->Language, $params['data']->Banned, $params['data']->UserId);
            }
            else {
                $uq = $afcdb->query("UPDATE Users SET FirstName=%s, LastName=%s, Mobile=%s, Description=%s, Zone=%s, Country=%s, MediaUrl=%s, Type=%s, Email=%s, Language=%s, Banned=%s WHERE UserId=%i", $params['data']->FirstName, $params['data']->LastName, $params['data']->Mobile, $params['data']->Description, $params['data']->Zone, $params['data']->Country, $params['data']->MediaUrl, $params['data']->Type, $params['data']->Email, $params['data']->Language, $params['data']->Banned, $params['data']->UserId);
                // $uq = $afcdb->query("UPDATE Users SET FirstName=%s, LastName=%s, Mobile=%s, Description=%s, Zone=%s, Country=%s, MediaUrl=%s WHERE UserId=%i", $params['data']->FirstName, $params['data']->LastName, $params['data']->Mobile, $params['data']->Description, $params['data']->Zone, $params['data']->Country, $params['data']->MediaUrl, $params['data']->UserId);
            }

            $result = new stdClass();
            $result->success = $uq;
            return json_encode($result);
        }
    }

    public function insertFacebookUser(array $params) {
        global $afcdb;

        $select = "SELECT FacebookId FROM Users WHERE FacebookId=%i";
        $user = $afcdb->queryFirstRow($select, $params['data']->FacebookId);

        $result = new stdClass();
        $result->userExist = $user;

        if(!$user) {
            $qr = $afcdb->insert('Users', array(
                'FacebookId' => $params['data']->FacebookId,
                'FirstName' => $params['data']->FirstName,
                'LastName' => $params['data']->LastName,
                'Email' => $params['data']->Email,
                'Language' => $params['data']->Language,
                'User' => $params['data']->User,
                'MediaUrl' => 'img/users/default-user-img.png',
                'Logged' => 1
            ));
            $userIdInserted = $afcdb->insertId();
            $uq = $afcdb->query("UPDATE Users SET User=%s WHERE UserId=%i", $params['data']->User.$userIdInserted, $userIdInserted);
            $select = "SELECT * FROM Users WHERE FacebookId=%s";
            $user = $afcdb->queryFirstRow($select, $params['data']->FacebookId);

            $result->success = $qr;
            $result->existingUser = false;
            $result->newUserId = $userIdInserted;
            $result->user = $user;


        }
        else {
            $uq = $afcdb->query("UPDATE Users SET Logged=%i WHERE FacebookId=%i", 1, $params['data']->FacebookId);
            $select = "SELECT * FROM Users WHERE FacebookId=%s";
            $user = $afcdb->queryFirstRow($select, $params['data']->FacebookId);

            $result->logginUser = $uq;
            $result->existingUser = true;
            $result->user = $user;
        }

        return json_encode($result);
    }

    public function insertFacebookUserInApp(array $params) {
        global $afcdb;

        $select = "SELECT FacebookId FROM Users WHERE FacebookId=%i";
        $user = $afcdb->queryFirstRow($select, $params['data']->FacebookId);

        $result = new stdClass();
        $result->userExist = $user;

        if(!$user) {
            $qr = $afcdb->insert('Users', array(
                'FacebookId' => $params['data']->FacebookId,
                'FirstName' => $params['data']->FirstName,
                'LastName' => $params['data']->LastName,
                'Email' => $params['data']->Email,
                'Language' => $params['data']->Language,
                'User' => $params['data']->User,
                'MediaUrl' => 'img/users/default-user-img.png',
                'LoggedInApp' => 1
            ));
            $userIdInserted = $afcdb->insertId();
            $uq = $afcdb->query("UPDATE Users SET User=%s WHERE UserId=%i", $params['data']->User.$userIdInserted, $userIdInserted);
            $select = "SELECT * FROM Users WHERE FacebookId=%s";
            $user = $afcdb->queryFirstRow($select, $params['data']->FacebookId);

            $result->success = $qr;
            $result->existingUser = false;
            $result->newUserId = $userIdInserted;
            $result->user = $user;


        }
        else {
            $uq = $afcdb->query("UPDATE Users SET LoggedInApp=%i WHERE FacebookId=%i", 1, $params['data']->FacebookId);
            $select = "SELECT * FROM Users WHERE FacebookId=%s";
            $user = $afcdb->queryFirstRow($select, $params['data']->FacebookId);

            $result->logginUser = $uq;
            $result->existingUser = true;
            $result->user = $user;
        }

        return json_encode($result);
    }

    public function recoverPassword(array $params) {
        global $afcdb;

        $mr = false;

        $select = "SELECT UserId FROM Users WHERE Email=%s";
        $user = $afcdb->queryFirstRow($select, $params['data']->Email);

        if($user) { // array_key_exists('sendEmail', $params) && $params['sendEmail']
            $Type = 'user-password-recover';
            $ExternalId = $user['UserId'];
            $Parameters = chr(mt_rand(97, 122)).substr(md5(time()),1);
            $validityHours = 24;

            $qr = $afcdb->insert('_ExternalRequests', array(
                'ExternalId' => $ExternalId,
                'Type' => $Type,
                'Parameters' => $Parameters,
                'CreationDate' => date('Y-m-d H:i:s'),
                'ExpiryDate' => date("Y-m-d H:i:s", strtotime("+{$validityHours} hours"))
            ));
            $qd = $afcdb->query("DELETE FROM _ExternalRequests WHERE Type = %s AND ExpiryDate < %s", 'user-password-recover', date('Y-m-d H:i:s'));
            $to = $params['data']->Email;

            $subject = 'Resetare parola cont Arise for Christ';
            $message = str_replace('[afcrecover]', $Parameters, $params['data']->EmailContent);

            // $headers .= 'To: Arise for Christ <' . $to . '>' . "\r\n";
            $headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";
            $headers .= 'From: Arise for Christ <info@ariseforchrist.com>' . "\r\n";
            $headers .= 'Reply-To: info@ariseforchrist.com' . "\r\n";
            $headers .= 'X-Mailer: PHP/' . phpversion();

            $mr = mail($to, $subject, $message, $headers);
        }

        $result = new stdClass();
       // var_dump($user, $qr, $mr);
        $result->success = $user && $qr && $mr ? true : false;

        return json_encode($result);
    }

    public function getExternalRequest(array $params) {
        // error_reporting(E_ALL);
        // ini_set('display_errors', true);
        global $afcdb;

        $select = "SELECT ExternalId FROM _ExternalRequests WHERE Type = %s AND Parameters = %s AND ExpiryDate >= %s";

        $request = $afcdb->queryFirstRow($select, $params['data']->Type, $params['data']->Parameters, date('Y-m-d H:i:s'));

        $result = new stdClass();
        $result->valid = $request ? true : false;
        $result->ExternalId = $request['ExternalId'];

        return json_encode($result);
    }

    public function changePassword(array $params) {
        global $afcdb;

        $uq = $afcdb->query("UPDATE Users SET Password=%s WHERE UserId=%i", password_hash($params['data']->Password, PASSWORD_DEFAULT), $params['data']->UserId);

        if(property_exists($params['data'], 'RequestParameters') && $params['data']->RequestParameters != '') {
            $qd = $afcdb->query("DELETE FROM _ExternalRequests WHERE Type = %s AND Parameters = %s", 'user-password-recover', $params['data']->RequestParameters);
        }

        $result = new stdClass();
        $result->success = $uq ? true : false;

        return json_encode($result);
    }

    public function saveContactMessage(array $params) {
        global $afcdb;

        $qr = $afcdb->insert('ContactMessages', array(
            'UserId' => $params['data']->userId,
            'FirstName' => $params['data']->firstName,
            'LastName' => $params['data']->lastName,
            'Email' => $params['data']->email,
            'Phone' => $params['data']->phone,
            'Message' => $params['data']->message
        ));

        $mr = false;
        if(array_key_exists('sendEmail', $params) && $params['sendEmail']) {
            $to = 'info@ariseforchrist.com';

            $subject = 'Mesaj contact Arise for Christ';
            $message = $params['data']->message;

            // $headers .= 'To: Arise for Christ <' . $to . '>' . "\r\n";
            $headers .= 'From: ' . $params['data']->firstName . ' ' . $params['data']->lastName . ' <' . $params['data']->email . '>' . "\r\n";
            $headers .= 'Reply-To: ' . $params['data']->email . "\r\n";
            $headers .= 'X-Mailer: PHP/' . phpversion();

            $mr = mail($to, $subject, $message, $headers);
        }

        $contactsQr = $afcdb->insert('Contacts', array(
            'UserId' => $params['data']->userId,
            'ContactUserId' => '0',
            'Type' => '1',
            'Name' => ($params['data']->firstName.' '.$params['data']->lastName),
            'Email' => $params['data']->email,
            'Mobile' => $params['data']->phone,
            'Address' => '',
            'Stage' => '1',
            'Details' => ''
        ));
        $contactInsertedId = $afcdb->insertId();

        $note = 'MESSAGE'."\r\n"."\r\n".$params['data']->message;
        $noteQr = $afcdb->insert('Notes', array(
            'RelatedEntityId' => $contactInsertedId,
            'RelatedEntityType' => 'Contacts',
            'UserId' => '0',
            'Type' => '1',
            'Private' => '0',
            'Note' => $note
        ));

        $result = new stdClass();
        $result->success = $qr;
        $result->contactsSuccess = $contactsQr;
        $result->mail = $mr;

        return json_encode($result);
    }

    public function saveEvangelismRequest(array $params) {
        global $afcdb;

        if($params['data']->UserId == null) {
            $params['data']->UserId = 0;
        }

        $qr = $afcdb->insert('EvangelismRequests', array(
            'UserId' => $params['data']->UserId,
            'ApplicantName' => $params['data']->ApplicantName,
            'ApplicantEmail' => $params['data']->ApplicantEmail,
            'ApplicantPhone' => $params['data']->ApplicantPhone,
            'Name' => $params['data']->Name,
            'Email' => $params['data']->Email,
            'Phone' => $params['data']->Phone,
            'Address' => $params['data']->Address,
            'Age' => $params['data']->Age,
            'Occupation' => $params['data']->Occupation,
            'EducationLevel' => $params['data']->EducationLevel,
            'Religion' => $params['data']->Religion,
            'AttitudeTowardsChristianity' => $params['data']->AttitudeTowardsChristianity,
            'OtherDetails' => $params['data']->OtherDetails
        ));

        $mr = false;
        if(array_key_exists('sendEmail', $params) && $params['sendEmail']) {
            $to = "info@ariseforchrist.com";

            $subject = 'Solicitare evanghelizare Arise for Christ';
            $message = $params['data']->htmlRequestMessage;

            $headers  = 'MIME-Version: 1.0' . "\r\n";
            $headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";
            // $headers .= 'To: Arise for Christ <' . $to . '>' . "\r\n";
            $headers .= 'From: ' . $params['data']->ApplicantName . ' <' . $params['data']->ApplicantEmail . '>' . "\r\n";
            $headers .= 'Reply-To: ' . $params['data']->ApplicantEmail . "\r\n";
            $headers .= 'X-Mailer: PHP/' . phpversion();

            $mr = mail($to, $subject, $message, $headers);
        }

        $details =  'Age: '.$params['data']->Age."\r\n".
                    'Occupation: '.$params['data']->Occupation."\r\n".
                    'Education level: '.$params['data']->EducationLevel."\r\n".
                    'Religion: '.$params['data']->Religion."\r\n".
                    'Attitude towards christianity: '.$params['data']->AttitudeTowardsChristianity."\r\n".
                    'Other details: '.$params['data']->OtherDetails."\r\n";
        $contactsQr = $afcdb->insert('Contacts', array(
            'UserId' => $params['data']->UserId,
            'ContactUserId' => '0',
            'Type' => '3',
            'Name' => $params['data']->Name,
            'Email' => $params['data']->Email,
            'Mobile' => $params['data']->Phone,
            'Address' => $params['data']->Address,
            'Stage' => '1',
            'Details' => $details
        ));
        $contactInsertedId = $afcdb->insertId();

        $note = 'APPLICANT DETAILS'."\r\n"."\r\n".
                'Name: '.$params['data']->ApplicantName."\r\n".
                'Email: '.$params['data']->ApplicantEmail."\r\n".
                'Mobile: '.$params['data']->ApplicantPhone;
        $noteQr = $afcdb->insert('Notes', array(
            'RelatedEntityId' => $contactInsertedId,
            'RelatedEntityType' => 'Contacts',
            'UserId' => '0',
            'Type' => '1',
            'Private' => '0',
            'Note' => $note
        ));

        $result = new stdClass();
        $result->success = $qr;
        $result->contactsSuccess = $contactsQr;
        $result->mail = $mr;

        return json_encode($result);
    }

    public function getComments(array $params) {
        global $afcdb;

        $idCondition = '';
        if(array_key_exists('id', $params)) {
            $idCondition = ' AND CommentId = '.$params['id'];
        }

        $filterConditions = '';
        if(array_key_exists('filter', $params) && count($params['filter']) > 0) {
            foreach($params['filter'] as $filter) {
                $filterConditions .= ' AND '.$filter[0].' '.$filter[1].' \''.$filter[2].'\'';
            }
        }

        $filterWithOrCondition = '';
        if(array_key_exists('filterWithOr', $params) && count($params['filterWithOr']) > 0) {
            $filterWithOrCondition = ' OR 1';
            foreach($params['filterWithOr'] as $filter) {
                $filterWithOrCondition .= ' AND '.$filter[0].' '.$filter[1].' \''.$filter[2].'\'';
            }
        }

        $searchCondition = '';
        if(array_key_exists('search', $params) && $params['search'] != '') {
            $searchCondition = $searchCondition." AND (Comments.Name LIKE '%".$params['search']."%' OR Comments.Name LIKE '".$params['search']."%' OR Comments.Name LIKE '%".$params['search']."' OR Comments.Name LIKE '".$params['search']."' OR Comments.Comment LIKE '%".$params['search']."%' OR Comments.Comment LIKE '".$params['search']."%' OR Comments.Comment LIKE '%".$params['search']."' OR Comments.Comment LIKE '".$params['search']."') ";
        }

        $order = ' ORDER BY ';
        if(array_key_exists('sort', $params) && count($params['sort']) > 0) {
            foreach ($params['sort'] as $key => $sField) {
                if(property_exists($sField, 'field')) {
                    $order .= $key == 0 ? $sField->field : ', '.$sField->field;
                    if(property_exists($sField, 'descending') && $sField->descending) {
                        $order .= ' DESC';
                    }
                }
            }
        }
        else {
            $order .= 'CreationDate, CommentId';
        }

        $limitAndOffset = '';
        if(array_key_exists('page', $params) && property_exists($params['page'], 'size') && property_exists($params['page'], 'offset')) {
            $limitAndOffset = ' LIMIT '.$params['page']->size.' OFFSET '.$params['page']->offset;
        }

        $selectPart = "SELECT Comments.CommentId, Comments.UserId, Comments.RelatedPostId, Comments.RelatedPostTable, Comments.RelatedCommentId, Comments.Name, Comments.Comment, Comments.Visibility, Comments.CreationDate, Users.FirstName AS FirstName, Users.LastName AS LastName, Users.Email AS UserEmail, Users.MediaUrl AS MediaUrl, Posts.Type AS RelatedPostType";
        $fromAndJoins = " FROM Comments LEFT JOIN Users ON Comments.UserId = Users.UserId LEFT JOIN Posts ON Comments.RelatedPostId = Posts.PostId";
        $conditions = " WHERE 1".$filterConditions.$filterWithOrCondition.$searchCondition;
        // $fromAndJoins = " FROM Posts LEFT JOIN Media ON Posts.MediaId = Media.MediaId LEFT JOIN Users ON Posts.UserId = Users.UserId"; // LEFT JOIN MediaCollection ON Content.MediaCollectionId = MediaCollection.CollectionId

        // $selectPart2 = "SELECT Posts.PostId, Posts.UserId, Posts.MediaId, Posts.MediaCollectionId, Posts.CategoryId, Posts.Type, Posts.Type, Posts.Post, Posts.Visibility, Posts.CreationDate, Media.Type AS MediaType, Media.Title AS MediaTitle, Media.Description AS MediaDescription, Media.Url AS MediaUrl, Media.EmbedCode AS MediaEmbedCode, Users.FirstName AS FirstName, Users.LastName AS LastName, Users.Type AS UserType, Users.MediaUrl AS UserMediaUrl";
        // $fromAndJoins2 = " FROM Posts LEFT JOIN Media ON Posts.MediaId = Media.MediaId LEFT JOIN Users ON Posts.UserId = Users.UserId";
        // $conditions2 = " WHERE Posts.PostId IN ".$postsIdRequired;//.$idCondition.$filterConditions;

        $qr = $afcdb->query($selectPart.$fromAndJoins.$conditions.$order.$limitAndOffset);
        $total = $afcdb->queryFirstField("SELECT COUNT(*)".$fromAndJoins.$conditions);

        foreach ($qr as $key => $comment) {
            $relatedPostId = array("RelatedPostId", "=", "0");
            $relatedPostTable = array("RelatedPostTable", "=", "Comments");
            $relatedCommentId = array("RelatedCommentId", "=", $comment["CommentId"]);
            $commentsFilter = array($relatedPostId, $relatedPostTable, $relatedCommentId);
            $commentsParams = array("filter" => $commentsFilter);
            $qr[$key]['_numberOfReplies'] = json_decode($this->getCommentsNumber($commentsParams))->total;
        }

        $result = new stdClass();
        $result->resultset = $qr;
        $result->query = $selectPart.$fromAndJoins.$conditions.$order.$limitAndOffset;
        $result->stats = new stdClass();
        $result->stats->resultset = count($qr);
        $result->stats->total = isset($total) ? $total : count($qr);

        return json_encode($result);
    }

    public function getCommentsNumber(array $params) {
        global $afcdb;

        $filterConditions = '';
        if(array_key_exists('filter', $params) && count($params['filter']) > 0) {
            foreach($params['filter'] as $filter) {
                $filterConditions .= ' AND '.$filter[0].' '.$filter[1].' \''.$filter[2].'\'';
            }
        }

        $filterWithOrCondition = '';
        if(array_key_exists('filterWithOr', $params) && count($params['filterWithOr']) > 0) {
            $filterWithOrCondition = ' OR 1';
            foreach($params['filterWithOr'] as $filter) {
                $filterWithOrCondition .= ' AND '.$filter[0].' '.$filter[1].' \''.$filter[2].'\'';
            }
        }

        $fromAndJoins = " FROM Comments";
        $conditions = " WHERE 1".$filterConditions.$filterWithOrCondition;

        $total = $afcdb->queryFirstField("SELECT COUNT(*)".$fromAndJoins.$conditions);

        $result = new stdClass();
        $result->total = $total;

        return json_encode($result);
    }

    public function updateCommentVisibility(array $params) {
        global $afcdb;

        $uq = $afcdb->query("UPDATE Comments SET Visibility=%i WHERE CommentId=%i", $params['Visibility'], $params['CommentId']);

        $result = new stdClass();
        $result->success = $uq;
        return json_encode($result);
    }

    public function deleteComment(array $params) {
        global $afcdb;

        $comment = $afcdb->queryFirstRow("SELECT Comments.CommentId, Comments.RelatedPostTable, Comments.RelatedCommentId, Comments.RelatedPostId FROM Comments WHERE CommentId = '".$params['CommentId']."'");
        $replies = $afcdb->query("SELECT Comments.CommentId, Comments.RelatedPostTable, Comments.RelatedCommentId, Comments.RelatedPostId FROM Comments WHERE RelatedPostId = '0' AND RelatedCommentId = '".$comment['CommentId']."'");
        foreach ($replies as $key => $reply) {
            $afcdb->query("DELETE FROM Notifications WHERE RelatedEntityId = '".$reply['CommentId']."' AND RelatedEntityTable = 'Comments'");
            $afcdb->query(" DELETE FROM Comments WHERE CommentId = %s", $reply['CommentId']);
        }
        $qd = $afcdb->query("DELETE FROM Comments WHERE CommentId = %s", $params['CommentId']);
        $qdNotification = $afcdb->query("DELETE FROM Notifications WHERE RelatedEntityId = '".$params['CommentId']."' AND RelatedEntityTable = 'Comments'");

        $total = $afcdb->queryFirstField("SELECT COUNT(*) FROM Comments WHERE RelatedPostId = '".$comment["RelatedPostId"]."' AND RelatedPostTable = '".$comment["RelatedPostTable"]."' AND RelatedCommentId = '".$comment["RelatedCommentId"]."' AND (Visibility = '1' OR (Visibility = '2' AND (UserId = '".$params["PostUserId"]."' OR UserId = '".$params["UserId"]."')))");

        $result = new stdClass();
        $result->success = $qd ? true : false;
        $result->stats = new stdClass();
        $result->stats->total = $total;

        return json_encode($result);
    }

    public function postComment(array $params) {
        global $afcdb;

        if(!property_exists($params['data'], 'Visibility')) {
            $params['data']->Visibility = '1';
        }

        $qr = $afcdb->insert('Comments', array(
            'UserId' => $params['data']->UserId,
            'RelatedPostId' => $params['data']->RelatedPostId,
            'RelatedPostTable' => $params['data']->RelatedPostTable,
            'RelatedCommentId' => $params['data']->RelatedCommentId,
            'Name' => $params['data']->Name,
            'Email' => $params['data']->Email,
            'Visibility' => $params['data']->Visibility,
            'Comment' => $params['data']->Comment,
            'UserMediaUrl' => $params['data']->MediaUrl ? $params['data']->MediaUrl : 'img/users/ariseforchrist1.jpg'
        ));
        $insertedId = $afcdb->insertId();

        $relatedPostIdField = '';
        if($params['data']->RelatedPostTable == 'Posts') {
            $relatedPostIdField = 'PostId';
        }
        else if($params['data']->RelatedPostTable == 'Posts') {
            $relatedPostIdField = 'PostId';
        }
        else if($params['data']->RelatedPostTable == 'Comments') {
            $relatedPostIdField = 'CommentId';
        }

        $relatedEntityId = '';
        if($params['data']->RelatedCommentId && $params['data']->RelatedCommentId != '0' && $params['data']->RelatedCommentId != '') {
            $relatedEntityId = $params['data']->RelatedCommentId;
        }
        else {
            $relatedEntityId = $params['data']->RelatedPostId;
        }

        $notificationResult = null;
        if($qr) {
            $relatedEntity = $afcdb->queryFirstRow("SELECT * FROM ".$params['data']->RelatedPostTable." WHERE ".$relatedPostIdField."=%s", $relatedEntityId);
            $action = '';
            if($params['data']->RelatedCommentId && $params['data']->RelatedCommentId != '0') {
                $action = 'reply';
            }
            else {
                $action = 'comment';
            }
            $params['data']->Action = $action;
            $params['data']->RelatedEntityId = $insertedId;
            $params['data']->RelatedEntityTable = 'Comments';
            $params['data']->TargetUserId = ($relatedEntity ? $relatedEntity['UserId'] : '');
            $params['data']->Description = $params['data']->Comment;
            if($action == 'reply') {
                $primaryEntity = $afcdb->queryFirstRow("SELECT * FROM Comments WHERE CommentId=%s", $params['data']->RelatedCommentId);
                $params['data']->TargetRelatedEntityId = $primaryEntity['RelatedPostId'];
            }
            else {
                $params['data']->TargetRelatedEntityId = $params['data']->RelatedPostId;
            }
            $params['data']->TargetRelatedEntityTable = $params['data']->RelatedPostTable;
            if($params['data']->RelatedPostTable == 'Posts') {
                $relatedEntityUrl = str_replace(' ', '-', $relatedEntity['Title']);
                $relatedEntityUrl = strtolower($relatedEntityUrl);
                $relatedEntityUrl = $relatedEntityUrl.'-'.$relatedEntity['PostId'];
                $params['data']->TargetPostUrl = $relatedEntityUrl;
            }
            else if($params['data']->RelatedPostTable == 'Posts' || $params['data']->RelatedPostTable == 'Comments') {
                $params['data']->TargetPostUrl = '';
            }
            if($action == 'reply') {
                $params['data']->TargetCommentId = $insertedId;
            }
            else {
                $params['data']->TargetCommentId = '';
            }
            $notificationResult = $this->createPeerToPeerNotification($params);
        }

        $total = $afcdb->queryFirstField("SELECT COUNT(*) FROM Comments WHERE RelatedPostId = '".$params['data']->RelatedPostId."' AND RelatedPostTable = '".$params['data']->RelatedPostTable."' AND RelatedCommentId = '".$params['data']->RelatedCommentId."' AND (Visibility = '1' OR (Visibility = '2' AND UserId = '".$params['data']->UserId."'))");

        $result = new stdClass();
        // $result->query = "SELECT * FROM ".$params['data']->RelatedPostTable." WHERE ".$relatedContentIdField."=%s", $relatedEntityId;
        // $result->relatedEntity = $relatedEntity;
        $result->success = $qr;
        $result->notificationResult = $notificationResult;
        $result->stats = new stdClass();
        $result->stats->total = $total;

        return json_encode($result);
    }

    public function deleteFile(array $params) {
        global $afcdb;

        $deleteSuccess = false;
        if($params['Url']) {
            chmod($params['Url'], 0777);
            $deleteSuccess = unlink($params['Url']);
        }
        // delete file from server

        $result = new stdClass();
        $result->success = $deleteSuccess;

        return json_encode($result);

    }

    public function followPage(array $params){
        global $afcdb;
        
        $select = "SELECT Subscribers FROM Pages WHERE PageId=%s";
        $page = $afcdb->queryFirstRow($select, $params['data']->PageId);
        
        if($page['Subscribers'] != null) {  
            $pageSubscribers = explode(',', $page['Subscribers']);
        }
        else {
            $pageSubscribers = array();
        }

        $success = false;
        if(!in_array($params['data']->UserId, $pageSubscribers)) {
            array_push($pageSubscribers, $params['data']->UserId);
            $success = $afcdb->query("UPDATE Pages SET Subscribers=%s WHERE PageId=%s", implode(',', $pageSubscribers), $params['data']->PageId);
        }
        
        // daca id user transmis se regaseste in array pageSubscribers atunci nu ai nimic de facut,
        // altfel adaugi user id-ul la array pageSubscribers si faci update la pagina cu PageId-ul initial la camp Subscribers cu valoarea noua -> faci implode cu ',' ca sa readuci din nou la forma de string

        $result = new stdClass();
        $result->success = $success;

        return json_encode($result);

    }

    public function unfollowPage(array $params){
        global $afcdb;
        
        $select = "SELECT Subscribers FROM Pages WHERE PageId=%s";
        $page = $afcdb->queryFirstRow($select, $params['data']->PageId);
        
        if($page['Subscribers'] != null) {  
            $pageSubscribers = explode(',', $page['Subscribers']);
        }
        else {
            $pageSubscribers = array();
        }

        $success = false;
        if(in_array($params['data']->UserId, $pageSubscribers)) {
            $pageSubscribers = array_diff($pageSubscribers, array($params['data']->UserId));
            $success = $afcdb->query("UPDATE Pages SET Subscribers=%s WHERE PageId=%s", implode(',', $pageSubscribers), $params['data']->PageId);
        }
        
        $result = new stdClass();
        $result->success = $success;

        return json_encode($result);

    }

    public function subscribeEmail(array $params) {
        $email = $params['data'];
        $result = new stdClass();
        $mailChimpClient = new Mailchimp('3acec026e3047ffaa7eb116f50cace12-us8');
        $result = $mailChimpClient->call('lists/subscribe', array(
            'id' => 'a1fd3925be',
            'email' => array(
                'email' => json_encode($email)
            ),
            'double_optin' => false

        ));

        return json_encode($result);
    }

    public function saveDeviceToken(array $params) {
        global $afcdb;

        $select = "SELECT * FROM Devices WHERE DeviceToken=%s";
        $device = $afcdb->queryFirstRow($select, $params['data']->Token);

        if($device == null) {
            $qr = $afcdb->insert('Devices', array(
                'UserId' => $params['data']->UserId,
                'DeviceToken' => $params['data']->Token
            ));
        }
        else {
            if($device['UserId'] != $params['data']->UserId) {
                $qr = $afcdb->query("UPDATE Devices SET UserId=%s WHERE DeviceToken=%s", $params['data']->UserId, $params['data']->Token);
            }
            else {
                $qr = true;
            }
        }

        $result = new stdClass();
        $result->success = $qr;
        return json_encode($result);
    }
	
	public function createPeerToPeerNotification(array $params) {
		global $afcdb;
		if(TargetUserId == null || TargetUserId == '' || TargetUserId == '0'){
			return -1;
		}
		$qr = $afcdb->insert('Notifications', array(
			'UserId' => $params['data']->UserId,
			'RelatedEntityId' => $params['data']->RelatedEntityId,
			'RelatedEntityTable' => $params['data']->RelatedEntityTable,
			'Action' => $params['data']->Action,
			'TargetUserId' => $params['data']->TargetUserId,
			'Seen' => '0'
		));
		$insertedId = $afcdb->insertId();	
		return $insertedId;
	}
	
	public function createBroadcastNotification(array $params) {
		$qr = $afcdb->insert('NotificationsBroadcast', array(
			'RelatedPostId' => $params['data']->RelatedPostId,
			'Action' => $params['data']->Action
		));
		$insertedId = $afcdb->insertId();	
		return $insertedId;
	}
	
	// unused
	function sendNotification() {
		// if($device == null) {
        //     $deviceTarget = '/topics/all';
        // }
        // else {
           //  $deviceTarget = $device['DeviceToken'];
        // }
		
        // $user = null;
        // $actionText = '';
        // if($params['data']->TargetUserId != '0' && $params['data']->TargetUserId != '') {
        //     $user = $afcdb->queryFirstRow("SELECT * FROM Users WHERE UserId=%s", $params['data']->TargetUserId);
        //     if($user['Language'] == 'ro') {
        //         if($params['data']->Action == 'comment') {
        //             $actionText = ' a adăugat un comentariu la cererea ta de rugăciune';
        //         }
        //         else if($params['data']->Action == 'reaction') {
        //             $actionText = ' se roagă pentru cererea ta de rugăciune';
        //         }
        //         else if($params['data']->Action == 'reply') {
        //             $actionText = ' a adăugat un răspuns la comentariul tău';
        //         }
        //     }
        //     else if($user['Language'] == 'en') {
        //         if($params['data']->Action == 'comment') {
        //             $actionText = ' added a comment to your prayer request';
        //         }
        //         else if($params['data']->Action == 'reaction') {
        //             $actionText = ' is praying for your prayer request';
        //         }
        //         else if($params['data']->Action == 'reply') {
        //             $actionText = ' added a reply to your comment';
        //         }
        //     }
        // }
        // else {
        //     if($params['data']->Action == 'post') {
        //         $actionText = ' a adăugat o cerere de rugaciune';
        //     }
        //     else {
        //         $actionText = ' a adăugat un articol nou';
        //     }
        // }

        // $broadcastingUser = $afcdb->queryFirstRow("SELECT * FROM Users WHERE UserId=%s", $params['data']->UserId);

        // if($qr && ($params['data']->UserId != $params['data']->TargetUserId || $params['data']->TargetUserId == '0') && (($params['data']->TargetUserId != '0' && $params['data']->TargetUserId != '' && $user && $user['LoggedInApp'] == '1' && $device) || ($device == null && $params['data']->TargetUserId == '0'))) {
        //     $fields = array(
        //         'notification' =>  array(
        //             'title' => $broadcastingUser['FirstName'].' '.$broadcastingUser['LastName'].$actionText,
        //             'body' => str_replace('<br>', ' ', str_replace('<br/>', ' ', str_replace('<br />', ' ', $params['data']->Description))),
        //             'sound' => 'default',
        //             'click_action' => 'FCM_PLUGIN_ACTIVITY',
        //             'icon' => 'fcm_push_icon',
        //         ),
        //         'condition': '"dogs" in topics || "cats" in topics',
        //         'data' => array(
        //             'NotificationId' => $insertedId,
        //             'RelatedEntityId' => $params['data']->RelatedEntityId,
        //             'RelatedEntityTable' => $params['data']->RelatedEntityTable,
        //             'TargetRelatedEntityId' => $params['data']->TargetRelatedEntityId,
        //             'TargetRelatedEntityTable' => $params['data']->TargetRelatedEntityTable,
        //             'Action' => $params['data']->Action,
        //             'TargetContentUrl' => $params['data']->TargetContentUrl,
        //             'TargetCommentId' => $params['data']->TargetCommentId,
        //             'Seen' => '0'
        //         ),
        //         'to' => $deviceTarget,
        //         'priority' => 'high',
        //         'restricted_package_name' => '',
        //     );

        //     $ch = curl_init();

        //     curl_setopt($ch, CURLOPT_URL, 'https://fcm.googleapis.com/fcm/send');
        //     curl_setopt($ch, CURLOPT_POST, true);
        //     curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        //         'Authorization: key=AIzaSyB8cgBpDFQ9pD_nWL4F1dTR8ktkuTRwpRc',
        //         'Content-Type: application/json'
        //     ));
        //     curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        //     curl_setopt($ch,CURLOPT_POSTFIELDS, json_encode($fields));

        //     $curlResult = curl_exec($ch);

        //     curl_close($ch);

        //     $result = new stdClass();
        //     $result->success = $curlResult;
        //     $result->targetContentUrl = $params['data']->TargetContentUrl;
        //     $result->deviceTarget = $deviceTarget;
        //     return $result;
        // }
        // else {
        //     $result = new stdClass();
        //     $result->success = false;
        //     return json_encode($result);
        // }

        // $emptyArr = array();
        // return json_encode($emptyArr);
	}


    public function sendEmailToPageSubscribers(array $params) {
        // error_reporting(E_ALL);
        // ini_set('display_errors', true);
        global $afcdb;
        
        $select = "SELECT * FROM Pages WHERE PageId=%s";
        $page = $afcdb->queryFirstRow($select, $params['data']->pageId);
        
        $subscribersData = array();
        if($page['Subscribers'] != '') {
            $subscribersDataQuery = "SELECT Email FROM Users WHERE UserId IN (".$page['Subscribers'].")";
            $subscribersData = $afcdb->query($subscribersDataQuery);
        }
        
        $subject = 'Postare noua pe pagina \''.$page['Name'].'\'';
        
        $message = '<p><i>'.nl2br($params['data']->message).'</i></p>';
        $message .= '<p>Accesati pagina <a href="http://ariseforchrist.com/pages/'.$page['Url'].'" target="_blank" title="'.$page['Name'].'"><strong>'.$page['Name'].'</strong></a> pentru mai multe detalii.</p>';
        $message .= '<p><strong>Echipa Arise for Christ</strong></p>';

        $headers = 'Content-type: text/html; charset=utf-8' . "\r\n";
        $headers .= 'From: Arise for Christ <info@ariseforchrist.com>' . "\r\n";
        $headers .= 'Reply-To: info@ariseforchrist.com' . "\r\n";
        $headers .= 'X-Mailer: PHP/' . phpversion();

        $sentEmails = 0;
        if(count($subscribersData) > 0) {
            foreach($subscribersData as $subscriber) {
                if(true) {
                    $to = $subscriber['Email'];
                    
                    $se = mail($to, $subject, $message, $headers);
                    if($se) { $sentEmails++; }
                }
            }
        }

        $result = new stdClass();
        $result->success = true;
        $result->sentEmails = $sentEmails;

        return json_encode($result);
    }

    public function getUnseenNotificationsNumber(array $params) {
        global $afcdb;

        $total = null;
        if($params['UserId'] == '0') {
            $total = $afcdb->query("SELECT COUNT(*) FROM Notifications WHERE TargetUserId = '0' AND Seen = '0'");
        }
        else if($params['UserId'] != '0' && $params['UserId'] != '') {
            $total = $afcdb->query("SELECT COUNT(*) FROM Notifications WHERE ((TargetUserId = ".$params['UserId']." AND TargetUserId <> UserId) OR (TargetUserId = '0' AND UserId <> ".$params['UserId'].")) AND Seen = '0'");
        }

        $result = new stdClass();
        $result->total = $total;
        $result->userid = $params['UserId'];
        return json_encode($result);
    }

    public function setNotificationSeen(array $params) {
        global $afcdb;

        $uq = $afcdb->query("UPDATE Notifications SET Seen=%s WHERE NotificationId=%s", '1', $params['NotificationId']);
        $useenNotificationsNumber = json_decode($this->getUnseenNotificationsNumber($params))->total;
        $result = new stdClass();
        $result->success = $uq;
        $result->total = $useenNotificationsNumber;
        return json_encode($result);
    }

    public function getNotifications(array $params) {

        global $afcdb;

        $notifications = $afcdb->query("SELECT * FROM Notifications WHERE TargetUserId = ".$params['TargetUserId']." AND UserId <> '".$params['TargetUserId']."' OR TargetUserId = '0' AND UserId <> '".$params['TargetUserId']."' ORDER BY CreationDate DESC LIMIT 40");
        $usersQuery = "SELECT Users.UserId, Users.FirstName, Users.LastName, Users.MediaUrl FROM Users WHERE ";
        $reactionsQuery = "SELECT Reactions.ReactionId, Reactions.RelatedContentId, Posts.Post FROM Reactions JOIN Posts ON Posts.PostId = Reactions.RelatedContentId WHERE ";
        $commentsQuery = "SELECT Comments.Comment, Comments.CommentId, Comments.RelatedContentId, Comments.RelatedContentTable, Comments.RelatedCommentId From Comments WHERE RelatedCommentId = '0' AND ( ";
        $repliesQuery = "SELECT Comments.Comment, Comments.CommentId, Comments.RelatedContentId, Comments.RelatedContentTable, Comments.RelatedCommentId From Comments WHERE RelatedCommentId <> '0' AND ( ";
        $postsQuery = "SELECT Posts.PostId, Posts.Post From Posts WHERE ";
        foreach ($notifications as $key => $notification) {
            if($notification['UserId'] != '0') {
                $usersQuery = $usersQuery."UserId = '".$notification['UserId']."' OR ";
            }
            if($notification['RelatedEntityTable'] == 'Reactions') {
                $reactionsQuery = $reactionsQuery."ReactionId = '".$notification['RelatedEntityId']."' OR ";
            }
            if($notification['RelatedEntityTable'] == 'Comments') {
                $commentsQuery = $commentsQuery."CommentId = '".$notification['RelatedEntityId']."' OR ";
            }
            if($notification['RelatedEntityTable'] == 'Comments') {
                $repliesQuery = $repliesQuery."CommentId = '".$notification['RelatedEntityId']."' OR ";
            }
            if($notification['RelatedEntityTable'] == 'Posts') {
                $postsQuery = $postsQuery."PostId = '".$notification['RelatedEntityId']."' OR ";
            }
        }
        $usersQuery = $usersQuery."UserId = '0'";
        $reactionsQuery = $reactionsQuery."0";
        $commentsQuery = $commentsQuery."0)";
        $repliesQuery = $repliesQuery."0)";
        $postsQuery = $postsQuery."0";
        $users = $afcdb->query($usersQuery);
        $reactions = $afcdb->query($reactionsQuery);
        $comments = $afcdb->query($commentsQuery);
        $replies = $afcdb->query($repliesQuery);
        $posts = $afcdb->query($postsQuery);
        $content = null;
        $relatedEntity = null;
        foreach ($notifications as $notificationKey => $notification) {
            foreach ($users as $userKey => $user) {
                if($notification['UserId'] == $user['UserId']) {
                    $notifications[$notificationKey]['FirstName'] = $user['FirstName'];
                    $notifications[$notificationKey]['LastName'] = $user['LastName'];
                    $notifications[$notificationKey]['MediaUrl'] = $user['MediaUrl'];
                }
            }
            if($notification['RelatedEntityTable'] == 'Reactions') {
                foreach ($reactions as $reactionKey => $reaction) {
                    if($notification['RelatedEntityId'] == $reaction['ReactionId']) {
                        $notifications[$notificationKey]['Description'] = $reaction['Post'];
                        $notifications[$notificationKey]['TargetRelatedEntityId'] = $reaction['RelatedContentId'];
                    }
                }
            }
            if($notification['RelatedEntityTable'] == 'Comments') {
                foreach ($comments as $commentKey => $comment) {
                    if($notification['RelatedEntityId'] == $comment['CommentId']) {
                        $notifications[$notificationKey]['Description'] = $comment['Comment'];
                        $notifications[$notificationKey]['TargetRelatedEntityId'] = $comment['RelatedContentId'];
                        if($comment['RelatedContentTable'] == 'Content') {
                            $content = $afcdb->queryFirstRow("SELECT Content.ContentId, Content.Title FROM Content WHERE ContentId = '".$comment['RelatedContentId']."'");
                            $targetContentUrl = $content['Title'];
                            $targetContentUrl = str_replace(' ', '-', $targetContentUrl);
                            $targetContentUrl = $targetContentUrl.'-'.$content['ContentId'];
                            $targetContentUrl = strtolower($targetContentUrl);
                            $notifications[$notificationKey]['TargetContentUrl'] = $targetContentUrl;
                        }
                    }
                }
                foreach ($replies as $replyKey => $reply) {
                    // $relatedEntity = 'abc';
                    if($notification['RelatedEntityId'] == $reply['CommentId']) {
                        $notifications[$notificationKey]['Description'] = $reply['Comment'];
                        $notifications[$notificationKey]['TargetCommentId'] = $reply['CommentId'];
                        $relatedEntity = $afcdb->queryFirstRow("SELECT Comments.CommentId, Comments.RelatedContentId FROM Comments WHERE CommentId = '".$reply['RelatedCommentId']."'");
                        $notifications[$notificationKey]['TargetRelatedEntityId'] = $relatedEntity['RelatedContentId'];
                    }
                }
            }
            if($notification['RelatedEntityTable'] == 'Posts') {$relatedEntity = 'abc';
                foreach ($posts as $postKey => $post) {
                    if($notification['RelatedEntityId'] == $post['PostId']) {
                        $notifications[$notificationKey]['Description'] = $post['Post'];
                        $notifications[$notificationKey]['TargetRelatedEntityId'] = '0';
                    }
                }
            }

        }
        $result = new stdClass();
        $result->resultset = $qr;
        $result->stats = new stdClass();
        $result->stats->resultset = count($qr);
        return json_encode($notifications);
    }

    public function combineTables() {
        global $afcdb;

        $comments = $afcdb->query("SELECT * FROM Comments WHERE RelatedPostTable = 'Posts'");
        $commentsRelatedIds = array();
        foreach($comments as $key => $comment) {
            $commentsRelatedIds[$comment['CommentId']] = $comment['RelatedPostId'];
        }

        $reactions = $afcdb->query("SELECT * FROM Reactions WHERE RelatedPostTable = 'Posts'");
        $reactionsRelatedIds = array();
        foreach($reactions as $key => $reaction) {
            $reactionsRelatedIds[$reaction['ReactionId']] = $reaction['RelatedPostId'];
        }

        $posts = $afcdb->query("SELECT * FROM Posts_old");

        foreach($posts as $key => $post) {
            $afcdb->insert('Posts', array(
                'RelatedPostId' => 0,
                'UserId' => $post['UserId'],
                'MediaId' => $post['MediaId'],
                'MediaCollectionId' => $post['MediaCollectionId'],
                'CategoryId' => $post['CategoryId'],
                'Type' => 'post', // $post['Type']
                'Title' => '',
                'Title_en' => '',
                'Description' => '',
                'Description_en' => '',
                'Post' => $post['Post'],
                'Post_en' => $post['Post'],
                'Author' => '',
                'Details' => '',
                'Date' => $post['CreationDate'],
                'PublishOnDate' => 0,
                'Visibility' => $post['Visibility'],
                'CreationDate' => $post['CreationDate']
            ));
            $insertedId = $afcdb->insertId();
            foreach($comments as $key => $comment) {
                if($commentsRelatedIds[$comment['CommentId']] && $post['PostId'] == $commentsRelatedIds[$comment['CommentId']]) {
                    // $commentsRelatedIds[$comment['CommentId']] = $insertedId;
                    $afcdb->query("UPDATE Comments SET RelatedPostId=%s WHERE CommentId=%i", $insertedId, $comment['CommentId']);
                }
            }
            foreach($reactions as $key => $reaction) {
                if($reactionsRelatedIds[$reaction['ReactionId']] && $post['PostId'] == $reactionsRelatedIds[$reaction['ReactionId']]) {
                    // $commentsRelatedIds[$comment['CommentId']] = $insertedId;
                    $afcdb->query("UPDATE Reactions SET RelatedPostId=%s WHERE ReactionId=%i", $insertedId, $reaction['ReactionId']);
                }
            }

        }

        $result = new stdClass();
        $result->resultset = $posts;
        return json_encode($result);
    }

    public function recaptchaValidation(array $params) {

        $params['data'] = $params['data'].'';
        $secret = '6LcVxAkUAAAAAHOgtKt0WIx3zEelaVkHgUGqGkWe';
        $verifyResponse = file_get_contents('https://www.google.com/recaptcha/api/siteverify?secret='.$secret.'&response='.$params['data']);

        return $verifyResponse;
    }

    private function appendLang($language, $column) {
        if($language != 'ro') {
            return $column.'_'.$language;
        }

        return $column;
    }

    private function curl_wrapper($url, $postdata)
    {
        // Get cURL resource
        $curl = curl_init();
        // Set some options - we are passing in a useragent too here
        curl_setopt_array($curl, array(
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_URL => $url,
            CURLOPT_USERAGENT => 'AFC',
            CURLOPT_POST => 1,
            CURLOPT_SSL_VERIFYHOST => 0,            // don't verify ssl
            CURLOPT_SSL_VERIFYPEER => false,        //
            CURLOPT_CONNECTTIMEOUT => 2,            // timeout on connect
            CURLOPT_TIMEOUT        => 2,            // timeout on response
            CURLOPT_POSTFIELDS => $postdata
        ));

        // Send the request & save response to $resp
        $resp = curl_exec($curl);

        if( curl_errno($curl) ) {
            // CURL-Error
            return false;
        }

        curl_close($curl);
        return $resp;
    }

}

$RPCserver = new Junior\Server(new AFCapi());
$RPCserver->process();
