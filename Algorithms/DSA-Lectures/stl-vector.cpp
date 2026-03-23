#include<iostream>
#include<vector>
using namespace std;

int main()
{
    //creation:vector<int> marks
    vector<int> marks;
    //by default Capacity:0
    //marks.reserve(10);
    //cout<<marks.max_size()<<endl;

    marks.push_back(10);
    marks.push_back(20);
    marks.push_back(30);
    marks.push_back(40);
    marks.push_back(50);
    //marks.clear();
    marks.insert(marks.begin(),100);

    //cout<<marks[0]<<endl;
    //cout<<marks.at(0)<<endl;
    cout<<marks.size()<<endl;
    cout<<marks.capacity()<<endl;//4->8
    
    //marks[0]=100;
    
    
    //Traversing in Vector
    
    for(int i: marks){
        cout<<i<<" ";
    }



    //Using Iterator:

    //Create an Iterator
    vector<int>::iterator it=marks.begin();
    while (it!=marks.end())
    {
        cout<<*it<<" ";
        it++;
    }
    
    

    marks.erase(marks.begin(), marks.end());

    //first.swap(second); swap two vectors

    /*cout<<"Size: "<<marks.size()<<endl;

    if(marks.empty()==true){
        cout<<"Empty.";
    }
    else cout<<"NOT Empty";
    */

    /*marks.pop_back();
    //40 will be removed:

    cout<<"Size: "<<marks.size()<<endl;
    cout<<marks.front()<<endl;
    cout<<marks.back()<<endl;

    //cout<<*(marks.begin())<<endl;

    vector<int> subjects(6);//no. of elements

    vector<int> distances(15, 0);//init with 0

    */
    //it=marks.begin()
    //*it:value at it
    //if(it<marks.end(){
    //      break;})
    return 0;
}