#include<iostream>
#include<vector>
#include<list>
#include<forward_list>
using namespace std;

int main()
{   
    vector<int> arr={10,20,30,40,50};
    //Random Access Iterator
    /*
    vector<int> arr={10,20,30,40,50};
    vector<int>::iterator it = arr.begin();

    while(it!=arr.end()){
        (*it)*=2;
        cout<<*it<<" ";
        it++;
    }
    */

    //backward*** .end points end of array ...last element is at arr.end()-1;
    /*
    
    vector<int>::iterator it= arr.end();
    while(it!=arr.begin()){
        it--;
        (*it)*=2;
        cout<<*it<<" ";
    }
    */

    //Random Access
    vector<int>::iterator it= arr.begin()+3;
    cout<<*it;




    /* Bidirectional Iterator

    list<int> myList;

    myList.push_back(10);
    myList.push_back(20);
    myList.push_back(30);

    list<int>::iterator it = myList.end();

    while(it!=myList.begin()){
        it--;//imp to put location of entry...entry @ -1
        *it+=10;
        cout<<*it<<" ";
        
    }

    */


    /* FORWARD ITERATOR
    forward_list<int> list;

    list.push_front(10);
    list.push_front(20);
    list.push_front(30);

    forward_list<int>::iterator it = list.begin();

    while(it!=list.end()){
        *it+=10;
        it++;
    }

    it=list.begin();
    while(it!=list.end()){
        cout<<*it<<" ";
        it++;
    }

    */


    /* ITERATOR REVISION

    vector<int> arr;
    arr.push_back(10);
    arr.push_back(20);
    arr.push_back(30);

    //creation
    vector<int>::iterator it=arr.begin();
    //traversal
    while(it!=arr.end()){
        cout<<*it<<" ";
        it++;
    }cout<<endl;

    */
    return 0;
}